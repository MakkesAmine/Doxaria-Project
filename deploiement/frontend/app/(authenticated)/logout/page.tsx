"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LogOut, Loader2 } from "lucide-react"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function LogoutPage() {
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [error, setError] = useState("")

  const handleLogout = async () => {
    setIsLoggingOut(true)
    setError("")

    try {
      // 1. Call the backend logout API endpoint
      const response = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Send the JWT token
        },
      })

      if (!response.ok) {
        // Handle specific HTTP errors
        if (response.status === 404) {
          throw new Error("Logout endpoint not found")
        } else if (response.status === 401) {
          throw new Error("Invalid token")
        } else {
          throw new Error("Logout failed")
        }
      }

      // 2. Clear the authentication token from localStorage
      localStorage.removeItem("token")

      // 3. Redirect to the login page
      router.push("/login")
    } catch (err) {
      console.error("Logout error:", err)
      setError(err instanceof Error ? err.message : "An error occurred during logout")
    } finally {
      setIsLoggingOut(false)
    }
  }

  const handleCancel = () => {
    router.back() // Go back to the previous page
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-100">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LogOut className="h-5 w-5" />
            Confirm Logout
          </CardTitle>
          <CardDescription>Are you sure you want to log out of your Doxaria account?</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            You will need to log in again to access your medical records, prescriptions, and AI assistance.
          </p>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleLogout} disabled={isLoggingOut}>
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </>
            )}
          </Button>
        </CardFooter>
        {error && (
          <p className="text-red-500 text-sm text-center mt-4">{error}</p>
        )}
      </Card>
    </div>
  )
}