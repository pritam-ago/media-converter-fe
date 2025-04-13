export interface User {
  id: string
  name: string
  email: string
}

export interface S3File {
  key: string
  name: string
  size: string
  url: string
  lastModified: Date
}
