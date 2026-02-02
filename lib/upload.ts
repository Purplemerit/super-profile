export async function uploadToS3(file: File, path: string = "general"): Promise<string> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", path);

    const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Upload failed");
    }

    const data = await response.json();
    return data.url;
}
