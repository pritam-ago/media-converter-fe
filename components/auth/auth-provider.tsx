"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@/lib/types"
import { API_URL } from "@/lib/config"

type AuthContextType = {
  user: User | null
  loading: boolean
  token: string | null
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signup: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper function to retry a fetch request
const fetchWithRetry = async (url: string, options: RequestInit, retries = 3, delay = 1000) => {
  try {
    const response = await fetch(url, options)
    return response
  } catch (error) {
    if (retries <= 1) throw error

    console.log(`Fetch failed, retrying in ${delay}ms... (${retries - 1} retries left)`)
    await new Promise((resolve) => setTimeout(resolve, delay))
    return fetchWithRetry(url, options, retries - 1, delay * 1.5)
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Check for JWT token in localStorage on initial load
  useEffect(() => {
    const checkAuth = () => {
      try {
        const storedToken = localStorage.getItem("jwt_token")
        if (storedToken) {
          // Set token
          setToken(storedToken)

          // Set basic user info - in a real app, you might want to fetch user details
          // from an endpoint like /api/auth/me using the token
          setUser({
            id: "user", // This will be replaced when you fetch actual user data
            name: "User",
            email: "",
          })
        }
      } catch (error) {
        console.error("Error checking authentication:", error)
        localStorage.removeItem("jwt_token")
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log("Attempting login to:", `${API_URL}/auth/user/login`)

      // Call the login API endpoint with retry logic
      const response = await fetchWithRetry(
        `${API_URL}/auth/user/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
          // Add cache control to prevent caching
          cache: "no-cache",
          // Add credentials to include cookies
          credentials: "include",
          // Add mode to handle CORS
          mode: "cors",
        },
        3, // 3 retries
        1000, // 1 second initial delay
      )

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type")
      let data

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        return {
          success: false,
          error: `Server returned non-JSON response: ${text.substring(0, 100)}${text.length > 100 ? "..." : ""}`,
        }
      }

      if (!response.ok) {
        return { success: false, error: data.message || "Login failed" }
      }

      // Store the JWT token
      const jwtToken = data.token
      localStorage.setItem("jwt_token", jwtToken)
      setToken(jwtToken)

      // Set basic user info
      setUser({
        id: data.userId || "user",
        name: data.username || email.split("@")[0],
        email: email,
      })

      // Navigate to dashboard
      router.push("/dashboard")

      return { success: true }
    } catch (error) {
      console.error("Login error:", error)
      return {
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : String(error)}. Please check your connection and try again.`,
      }
    }
  }

  const signup = async (username: string, email: string, password: string) => {
    try {
      console.log("Attempting signup to:", `${API_URL}/auth/user/signup`)

      // Call the signup API endpoint with retry logic
      const response = await fetchWithRetry(
        `${API_URL}/auth/user/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, email, password }),
          // Add cache control to prevent caching
          cache: "no-cache",
          // Add credentials to include cookies
          credentials: "include",
          // Add mode to handle CORS
          mode: "cors",
        },
        3, // 3 retries
        1000, // 1 second initial delay
      )

      // Handle non-JSON responses
      const contentType = response.headers.get("content-type")
      let data

      if (contentType && contentType.includes("application/json")) {
        data = await response.json()
      } else {
        const text = await response.text()
        console.error("Non-JSON response:", text)
        return {
          success: false,
          error: `Server returned non-JSON response: ${text.substring(0, 100)}${text.length > 100 ? "..." : ""}`,
        }
      }

      // Check if the request was successful
      if (!response.ok) {
        return { success: false, error: data.message || "Signup failed" }
      }

      // Store the JWT token
      const jwtToken = data.token
      localStorage.setItem("jwt_token", jwtToken)
      setToken(jwtToken)

      // Set basic user info
      setUser({
        id: data.userId || "user",
        name: username,
        email: email,
      })

      // Navigate to dashboard
      router.push("/dashboard")

      return { success: true }
    } catch (error) {
      console.error("Signup error:", error)
      return {
        success: false,
        error: `Network error: ${error instanceof Error ? error.message : String(error)}. Please check if the backend server is running and accessible.`,
      }
    }
  }

  const logout = () => {
    // Remove the token from localStorage
    localStorage.removeItem("jwt_token")

    // Clear the user state
    setUser(null)
    setToken(null)

    // Navigate to home
    router.push("/")
  }

  return <AuthContext.Provider value={{ user, token, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
