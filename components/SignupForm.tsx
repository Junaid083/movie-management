"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (response.ok) {
        toast.success("Account created successfully");
        router.push("/signin");
      } else {
        toast.error(responseData.message || "Failed to create account");
      }
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[475px] px-4 sm:px-8">
      <h1 className="text-3xl sm:text-4xl font-semibold text-white mb-8 sm:mb-[60px] text-center">
        Sign up
      </h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-6"
      >
        <div>
          <Input
            type="text"
            placeholder="Name"
            {...register("name")}
            className="h-12 sm:h-16 bg-[#224957] border-none text-white placeholder:text-white/60 text-sm sm:text-base px-4 sm:px-6 rounded-lg focus:ring-2 focus:ring-[#20df7f]"
            aria-label="Name"
          />
          {errors.name && (
            <p className="text-[#ff6b6b] text-xs sm:text-sm mt-2">
              {errors.name.message}
            </p>
          )}
        </div>
        <div>
          <Input
            type="email"
            placeholder="Email"
            {...register("email")}
            className="h-12 sm:h-16 bg-[#224957] border-none text-white placeholder:text-white/60 text-sm sm:text-base px-4 sm:px-6 rounded-lg focus:ring-2 focus:ring-[#20df7f]"
            aria-label="Email"
          />
          {errors.email && (
            <p className="text-[#ff6b6b] text-xs sm:text-sm mt-2">
              {errors.email.message}
            </p>
          )}
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            {...register("password")}
            className="h-12 sm:h-16 bg-[#224957] border-none text-white placeholder:text-white/60 text-sm sm:text-base px-4 sm:px-6 rounded-lg focus:ring-2 focus:ring-[#20df7f]"
            aria-label="Password"
          />
          {errors.password && (
            <p className="text-[#ff6b6b] text-xs sm:text-sm mt-2">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 sm:h-16 bg-[#20df7f] hover:bg-[#20df7f]/90 text-white text-sm sm:text-base font-semibold rounded-lg transition-colors duration-200 ease-in-out focus:ring-2 focus:ring-offset-2 focus:ring-[#20df7f] active:translate-y-0.5"
        >
          {isLoading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
      <p className="text-white text-center mt-4 text-sm sm:text-base">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="text-[#20df7f] hover:underline focus:outline-none focus:ring-2 focus:ring-[#20df7f]"
        >
          Sign In
        </Link>
      </p>
    </div>
  );
}
