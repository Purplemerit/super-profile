import { NextRequest, NextResponse } from "next/server";
import { PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { s3Client, BUCKET_NAME } from "@/lib/s3";

// Helper to read JSON from S3
async function readJsonFromS3(key: string) {
    try {
        const command = new GetObjectCommand({
            Bucket: BUCKET_NAME,
            Key: key,
        });
        const response = await s3Client.send(command);
        const body = await response.Body?.transformToString();
        return body ? JSON.parse(body) : null;
    } catch (e) {
        return null;
    }
}

// Helper to write JSON to S3
async function writeJsonToS3(key: string, data: any) {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: key,
        Body: JSON.stringify(data),
        ContentType: "application/json",
    });
    await s3Client.send(command);
}

export async function POST(req: NextRequest) {
    try {
        const { formData, websiteEntry } = await req.json();
        const slug = websiteEntry.slug;

        if (!slug) {
            return NextResponse.json({ error: "Slug is required" }, { status: 400 });
        }

        // 1. Save individual website config
        await writeJsonToS3(`data/configs/${slug}.json`, formData);

        // 2. Update central index for search optimization
        let index = await readJsonFromS3("data/index.json") || [];
        // Remove existing entry if it exists
        index = index.filter((site: any) => site.slug !== slug);
        // Add new entry at the beginning
        index.unshift(websiteEntry);

        await writeJsonToS3("data/index.json", index);

        console.log(`DEBUG: Website ${slug} published and indexed.`);

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Publish error:", error);
        return NextResponse.json({ error: error.message || "Failed to publish" }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q")?.toLowerCase();
        const slug = searchParams.get("slug");

        // If a specific slug is requested, return the full config
        if (slug) {
            const config = await readJsonFromS3(`data/configs/${slug}.json`);
            if (!config) {
                return NextResponse.json({ error: "Website not found" }, { status: 404 });
            }
            return NextResponse.json(config);
        }

        // Return the search-optimized index
        const index = await readJsonFromS3("data/index.json") || [];

        if (query) {
            const filtered = index.filter((site: any) =>
                site.title.toLowerCase().includes(query) ||
                site.slug.toLowerCase().includes(query)
            );
            return NextResponse.json(filtered);
        }

        return NextResponse.json(index);
    } catch (error: any) {
        return NextResponse.json({ error: "Failed to fetch index" }, { status: 500 });
    }
}
