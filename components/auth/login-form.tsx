"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "./auth-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Eye, EyeOff, Lock, Mail, AlertTriangle, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { API_URL } from "@/lib/config"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [apiStatus, setApiStatus] = useState<"unknown" | "checking" | "online" | "offline">("unknown")
  const { login } = useAuth()
  const { toast } = useToast()

  // Function to check API status
  const checkApiStatus = async () => {
    setApiStatus("checking")
    try {
      const response = await fetch(`http://localhost:3000`, {
        method: "HEAD",
        mode: "cors",
        cache: "no-cache",
      })

      if (response.ok || response.status === 405) {
        setApiStatus("online")
        return true
      } else {
        setApiStatus("offline")
        return false
      }
    } catch (error) {
      console.error("API check failed:", error)
      setApiStatus("offline")
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    // Check API status first
    const isApiOnline = await checkApiStatus()
    if (!isApiOnline) {
      setError(`Cannot connect to API at ${API_URL}. Please check if the server is running and accessible.`)
      setIsLoading(false)
      toast({
        title: "Connection Error",
        description: "Cannot connect to the API server",
        variant: "destructive",
      })
      return
    }

    try {
      const result = await login(email, password)

      if (result.success) {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        })
        // The redirect is handled in the login function
      } else {
        setError(result.error || "Login failed. Please try again.")
        toast({
          title: "Login failed",
          description: result.error,
          variant: "destructive",
        })
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.")
      toast({
        title: "Login failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // Function to handle mock login (fallback when API is not available)
  const handleMockLogin = () => {
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      // Store a mock token
      const mockToken = "mock_jwt_token_for_testing"
      localStorage.setItem("jwt_token", mockToken)

      toast({
        title: "Mock Login Successful",
        description: "This is a mock login for testing. No actual API call was made.",
      })

      // Redirect to dashboard
      window.location.href = "/dashboard"

      setIsLoading(false)
    }, 1000)
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="w-[350px] shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Login</CardTitle>
          <CardDescription className="text-center">Enter your credentials to access your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <Link href="/forgot-password" className="text-xs text-purple-600 hover:underline">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:text-gray-600"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </Button>
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>

          {/* API connection status */}
          <div className="mt-4 text-xs text-gray-500 text-center">
            <p>
              API Status:{" "}
              <span
                className={
                  apiStatus === "online"
                    ? "text-green-500"
                    : apiStatus === "offline"
                      ? "text-red-500"
                      : apiStatus === "checking"
                        ? "text-yellow-500"
                        : "text-gray-500"
                }
              >
                {apiStatus === "online"
                  ? "Connected"
                  : apiStatus === "offline"
                    ? "Disconnected"
                    : apiStatus === "checking"
                      ? "Checking..."
                      : "Unknown"}
              </span>
            </p>
            <p className="mt-1">
              <code className="bg-gray-100 dark:bg-gray-800 p-1 rounded">{API_URL}</code>
            </p>

            {apiStatus === "offline" && (
              <div className="mt-3 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded text-yellow-800 dark:text-yellow-200">
                <p className="font-medium">API is not accessible</p>
                <p className="mt-1">You can use the mock login for testing:</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-2 w-full border-yellow-300 hover:bg-yellow-100"
                  onClick={handleMockLogin}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Use Mock Login"}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-sm text-center text-gray-500">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-purple-600 hover:underline">
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  )
}
