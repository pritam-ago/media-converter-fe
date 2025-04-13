import { FileText, ImageIcon, Music, Video, File } from "lucide-react"
import React from "react"
import type { FileWithPath } from "react-dropzone"

// File format categories
const audioFormats = ["mp3", "wav", "ogg", "flac", "aac", "m4a"]
const videoFormats = ["mp4", "avi", "mov", "mkv", "webm", "wmv", "flv"]
const imageFormats = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp", "tiff"]
const documentFormats = ["pdf", "doc", "docx", "txt", "rtf", "odt", "xls", "xlsx", "ppt", "pptx"]

// Detect file format from file extension
export function detectFileFormat(file: FileWithPath): string {
  const extension = file.name.split(".").pop()?.toLowerCase() || ""
  return extension
}

// Get file category based on extension
export function getFileCategory(extension: string): "audio" | "video" | "image" | "document" | "other" {
  if (audioFormats.includes(extension)) return "audio"
  if (videoFormats.includes(extension)) return "video"
  if (imageFormats.includes(extension)) return "image"
  if (documentFormats.includes(extension)) return "document"
  return "other"
}

// Get compatible formats for conversion based on source format
export function getCompatibleFormats(fromType: string): string[] {
  const category = getFileCategory(fromType)

  switch (category) {
    case "audio":
      return audioFormats
    case "video":
      return [...videoFormats, ...audioFormats] // Videos can be converted to audio
    case "image":
      return imageFormats
    case "document":
      return documentFormats
    default:
      return []
  }
}

type FileCategory = "audio" | "video" | "image" | "document"

const iconMap: Record<FileCategory, React.ElementType> = {
  audio: Music,
  video: Video,
  image: ImageIcon,
  document: FileText,
}

export function getFileIcon(fileName: string, className = "h-5 w-5") {
  const extension = fileName.split(".").pop()?.toLowerCase() || ""
  const category = getFileCategory(extension) as FileCategory

  const IconComponent = iconMap[category] || File
  return React.createElement(IconComponent, { className })
}