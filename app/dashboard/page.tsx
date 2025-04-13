"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardTabs } from "@/components/dashboard/dashboard-tabs"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle } from "lucide-react"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [isMockAuth, setIsMockAuth] = useState(false)

  useEffect(() => {
    // Check if we're using mock authentication
    const token = localStorage.getItem("jwt_token")
    if (token === "mock_jwt_token_for_testing") {
      setIsMockAuth(true)
    }

    // Redirect if not authenticated
    if (!loading && !user && !isMockAuth) {
      router.push("/login")
    }
  }, [user, loading, router, isMockAuth])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    )
  }

  // If using mock authentication, show a warning
  if (isMockAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto py-8 px-4">
          <Alert variant="warning" className="mb-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertTitle>Mock Authentication</AlertTitle>
            <AlertDescription>
              You are using mock authentication for testing. API calls will not work in this mode.
            </AlertDescription>
          </Alert>

          <DashboardTabs userId="mock-user-123" />

          <div className="mt-8 text-center">
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("jwt_token")
                router.push("/login")
              }}
            >
              Exit Mock Mode
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <DashboardTabs userId={user.id} />
    </div>
  )
}
