import type { User } from "./types"

// This function is no longer needed as we're not decoding JWT in the frontend
// We're keeping it as a placeholder in case you need it later
export function jwtDecode(token: string): User {
  // In a real implementation, you would properly decode the JWT
  // But since verification is done on the backend, we'll just return a placeholder
  return {
    id: "user",
    name: "User",
    email: "",
  }
}

// These functions are no longer needed as we're using the API directly
export async function handleLogin(email: string, password: string): Promise<{ user: User }> {
  throw new Error("Not implemented - use the API directly")
}

export async function handleLogout(): Promise<void> {
  throw new Error("Not implemented - use the API directly")
}

export async function handleSignup(email: string, password: string, name: string): Promise<{ success: boolean }> {
  throw new Error("Not implemented - use the API directly")
}
