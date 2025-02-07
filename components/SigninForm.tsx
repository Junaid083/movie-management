"use client"

import { useState, type FormEvent } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { toast } from "sonner"
import Link from "next/link"

export function SigninForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      setIsLoading(true)
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        toast.error("Invalid credentials")
        return
      }

      if (result?.ok) {
        toast.success("Logged in successfully")
        router.push("/movies")
        router.refresh()
      } else {
        toast.error("An unexpected error occurred")
      }
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-[475px] px-4 sm:px-8">
      <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-8 sm:mb-[60px] text-center">Sign in</h1>
      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 sm:h-16 bg-[#224957] border-none text-white placeholder:text-white/60 text-sm sm:text-base px-4 sm:px-6 rounded-lg"
          required
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 sm:h-16 bg-[#224957] border-none text-white placeholder:text-white/60 text-sm sm:text-base px-4 sm:px-6 rounded-lg"
          required
        />
        <div className="flex items-center">
          <Checkbox
            id="rememberMe"
            checked={rememberMe}
            onCheckedChange={(checked) => setRememberMe(checked as boolean)}
            className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white data-[state=checked]:bg-[#20df7f] data-[state=checked]:border-[#20df7f]"
          />
          <label htmlFor="rememberMe" className="ml-2 sm:ml-3 text-white text-sm sm:text-base">
            Remember me
          </label>
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 sm:h-16 bg-[#20df7f] hover:bg-[#20df7f]/90 text-white text-sm sm:text-base font-semibold rounded-lg"
        >
          {isLoading ? "Signing in..." : "Login"}
        </Button>
      </form>
      <p className="text-white text-center mt-4 text-sm sm:text-base">
        Don't have an account?{" "}
        <Link href="/signup" className="text-[#20df7f] hover:underline">
          Sign Up
        </Link>
      </p>
    </div>
  )
}

