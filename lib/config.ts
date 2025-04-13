// Configuration for the application
// This allows us to centralize configuration values

// API URL - use environment variable or default
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

// Other configuration values can be added here
export const APP_NAME = "Media Converter"
export const APP_DESCRIPTION = "Convert your media files with ease"

// Feature flags
export const FEATURES = {
  // Enable/disable features
  FILE_CONVERSION: true,
  CLOUD_STORAGE: true,
  USER_PROFILES: false,
}
