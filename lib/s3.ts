import type { S3File } from "./types"
import { API_URL } from "@/lib/config"

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("jwt_token")
  }
  return null
}

const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken()

  if (!token) {
    throw new Error("Authentication token not found")
  }

  const headers = {
    ...options.headers,
    Authorization: `Bearer ${token}`,
  }

  try {
    return await fetch(url, {
      ...options,
      headers,
      cache: "no-cache",
    })
  } catch (error) {
    console.error(`Network error when fetching ${url}:`, error)
    throw new Error(
      `Network error: ${error instanceof Error ? error.message : String(error)}. Please check if the backend server is running.`,
    )
  }
}

export async function getUserFolders(userId: string): Promise<string[]> {
  try {
    console.log("Fetching folders from:", `${API_URL}/files/list`);
    const response = await fetchWithAuth(`${API_URL}/files/list`);
    if (!response.ok) throw new Error("Failed to fetch folders");

    const data = await response.json();
    const folders = new Set<string>();

    data.forEach((item: any, index: number) => {
      const key = item?.key || item?.Key;
      const type = item?.type;

      if (type === "folder" && typeof key === "string") {
        const parts = key.split("/").filter(Boolean);
        
        if (parts.length === 3 && parts[0] === "users" && parts[1] === userId) {
          folders.add(parts[2]);
        }
      }
    });

    return Array.from(folders);
  } catch (error) {
    console.error("Error fetching folders:", error);
    return [];
  }
}

export async function getUserFiles(userId: string, folder: string | null = null) {
  try {
    const prefix = folder ? `?prefix=${encodeURIComponent(folder)}` : "";
    const response = await fetchWithAuth(`${API_URL}/files/list${prefix}`);

    if (!response.ok) {
      throw new Error("Failed to fetch files");
    }

    const data = await response.json();
    console.log("Fetched files data:", data);

    if (!data || !Array.isArray(data)) {
      console.error("No files or invalid data structure:", data);
      return [];
    }

    return data.map((item: any) => {
      if (item.type === "folder") {
        return {
          type: "folder",
          name: item.name,
          key: item.key,
        };
      } else {
        return {
          type: "file",
          name: item.name,
          key: item.key,
          size: item.size,
          lastModified: new Date(item.lastModified),
        };
      }
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    return [];
  }
}



export async function createFolder(userId: string, folderName: string): Promise<void> {
  try {
    console.log("Creating folder:", folderName)
    const response = await fetchWithAuth(`${API_URL}/files/folder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderName }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to create folder")
    }
  } catch (error) {
    console.error("Error creating folder:", error)
    throw error
  }
}

export async function deleteFolder(userId: string, folderName: string): Promise<void> {
  try {
    // This endpoint isn't specified in the API docs, but we'll assume it exists
    console.log("Deleting folder:", folderName)
    const response = await fetchWithAuth(`${API_URL}/files/folder?folderName=${encodeURIComponent(folderName)}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete folder")
    }
  } catch (error) {
    console.error("Error deleting folder:", error)
    throw error
  }
}

export async function deleteFile(userId: string, fileKey: string): Promise<void> {
  try {
    // This endpoint isn't specified in the API docs, but we'll assume it exists
    console.log("Deleting file:", fileKey)
    const response = await fetchWithAuth(`${API_URL}/files?key=${encodeURIComponent(fileKey)}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to delete file")
    }
  } catch (error) {
    console.error("Error deleting file:", error)
    throw error
  }
}

export async function uploadToS3({
  file,
  fileName,
  folderPath,
  userId,
}: {
  file: Blob
  fileName: string
  folderPath: string
  userId: string
}): Promise<void> {
  try {
    console.log("Uploading file:", fileName, "to folder:", folderPath)
    const formData = new FormData()
    formData.append("files", file, fileName)

    if (folderPath && folderPath !== "root") {
      formData.append("folderPath", folderPath)
    }

    const token = getAuthToken()
    if (!token) {
      throw new Error("Authentication token not found")
    }

    const response = await fetch(`${API_URL}/files/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        // Note: Don't set Content-Type here, it will be set automatically with the boundary
      },
      body: formData,
      // Add cache control to prevent caching
      cache: "no-cache",
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Failed to upload file" }))
      throw new Error(error.message || "Failed to upload file")
    }
  } catch (error) {
    console.error("Error uploading file:", error)
    throw error
  }
}

// Function to get a signed URL for a file
export async function getSignedUrl(fileKey: string): Promise<string> {
  try {
    console.log("Getting signed URL for:", fileKey)
    const response = await fetchWithAuth(`${API_URL}/files/url?key=${encodeURIComponent(fileKey)}`)

    if (!response.ok) {
      throw new Error("Failed to get signed URL")
    }

    const data = await response.json()
    return data.url
  } catch (error) {
    console.error("Error getting signed URL:", error)
    throw error
  }
}
