"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import { API_URL } from "@/lib/config"

export function DebugPanel() {
  const { user, token } = useAuth()
  const [showDebug, setShowDebug] = useState(false)
  const [cookies, setCookies] = useState<string[]>([])
  const [apiStatus, setApiStatus] = useState<"checking" | "online" | "offline" | "unknown">("unknown")
  const [apiError, setApiError] = useState<string | null>(null)

  const checkCookies = () => {
    setCookies(document.cookie.split(";").map((cookie) => cookie.trim()))
  }

  const checkApiStatus = async () => {
    setApiStatus("checking")
    setApiError(null)

    try {
      // Try to ping the API - we'll use a simple endpoint that should be available
      // If your API doesn't have a health or status endpoint, you can try the login endpoint
      // with a HEAD request which won't actually attempt to login
      const response = await fetch(`${API_URL}/auth/user/login`, {
        method: "HEAD", // Just check if the endpoint exists, don't send data
        mode: "cors",
        // Add cache control to prevent caching
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (response.ok || response.status === 405) {
        // 405 = Method Not Allowed, which is fine for our check
        setApiStatus("online")
      } else {
        setApiStatus("offline")
        setApiError(`Status: ${response.status} ${response.statusText}`)
      }
    } catch (error) {
      console.error("API check failed:", error)
      setApiStatus("offline")
      setApiError(`Error: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  useEffect(() => {
    if (showDebug) {
      checkApiStatus()
    }
  }, [showDebug])

  if (!showDebug) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="fixed bottom-4 right-4 opacity-50 hover:opacity-100"
        onClick={() => setShowDebug(true)}
      >
        Debug
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-96 shadow-lg z-50">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-sm">Debug Panel</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setShowDebug(false)}>
            Close
          </Button>
        </div>
      </CardHeader>
      <CardContent className="text-xs space-y-2 max-h-[80vh] overflow-auto">
        <div>
          <strong>Auth Status:</strong> {user ? "Logged In" : "Not Logged In"}
        </div>
        {user && (
          <div>
            <strong>User:</strong> {user.name} ({user.email || "No email"})
          </div>
        )}
        <div>
          <strong>API URL:</strong> {API_URL}
        </div>
        <div>
          <strong>API Status:</strong>{" "}
          <span
            className={
              apiStatus === "online"
                ? "text-green-500"
                : apiStatus === "offline"
                  ? "text-red-500"
                  : apiStatus === "unknown"
                    ? "text-gray-500"
                    : "text-yellow-500"
            }
          >
            {apiStatus === "checking"
              ? "Checking..."
              : apiStatus === "online"
                ? "Online"
                : apiStatus === "offline"
                  ? "Offline"
                  : "Unknown"}
          </span>
          <Button variant="outline" size="sm" className="ml-2" onClick={checkApiStatus}>
            Check
          </Button>
        </div>
        {apiError && (
          <div className="text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
            <strong>API Error:</strong> {apiError}
          </div>
        )}
        <div>
          <strong>JWT Token:</strong>{" "}
          <div className="mt-1 bg-gray-100 dark:bg-gray-800 p-1 rounded overflow-hidden">
            <div className="truncate">{token || "No token"}</div>
          </div>
        </div>
        <div>
          <Button variant="outline" size="sm" onClick={checkCookies}>
            Check Cookies
          </Button>
        </div>
        {cookies.length > 0 && (
          <div>
            <strong>Cookies:</strong>
            <ul className="mt-1 space-y-1">
              {cookies.map((cookie, i) => (
                <li key={i} className="bg-gray-100 dark:bg-gray-800 p-1 rounded">
                  {cookie}
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="text-gray-500 mt-4 border-t pt-2">
          <p>
            <strong>Troubleshooting:</strong> If API is offline, check that your backend server is running at{" "}
            {API_URL.replace("/api", "")}
          </p>
          <p className="mt-1">Make sure CORS is enabled on your backend to allow requests from this origin.</p>
        </div>
      </CardContent>
    </Card>
  )
}
