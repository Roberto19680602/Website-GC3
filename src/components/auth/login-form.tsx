"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long"),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToRegister: () => void;
  onLoginSuccess: (user: any) => void;
}

export const LoginForm = ({ onSwitchToRegister, onLoginSuccess }: LoginFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const rememberMe = watch("rememberMe");

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      // Store JWT token in localStorage
      localStorage.setItem("authToken", result.token);
      
      // Store remember me preference
      if (data.rememberMe) {
        localStorage.setItem("rememberMe", "true");
      } else {
        localStorage.removeItem("rememberMe");
      }

      toast.success("Login successful!", {
        description: `Welcome back, ${result.user.name}!`,
      });

      // Call success callback with user data
      onLoginSuccess(result.user);

    } catch (error) {
      console.error("Login error:", error);
      
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred";
      
      toast.error("Login failed", {
        description: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0">
      <CardHeader className="space-y-1 pb-6">
        <div className="flex items-center justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-[#1E5F99] to-[#55ACEE] rounded-lg flex items-center justify-center">
            <div className="text-white font-bold text-xl">GC3</div>
          </div>
        </div>
        <CardTitle className="text-2xl font-bold text-center text-[#1E5F99]">
          Welcome Back
        </CardTitle>
        <CardDescription className="text-center text-[#4A4A4A]">
          Sign in to your GC3 Consultoría account
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-[#4A4A4A]">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register("email")}
              className={`h-12 border-[#ddd] focus:border-[#1E5F99] focus:ring-[#1E5F99] ${
                errors.email ? "border-destructive" : ""
              }`}
              disabled={isLoading}
            />
            {errors.email && (
              <p className="text-sm text-destructive font-medium">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-[#4A4A4A]">
              Password
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={`h-12 pr-12 border-[#ddd] focus:border-[#1E5F99] focus:ring-[#1E5F99] ${
                  errors.password ? "border-destructive" : ""
                }`}
                disabled={isLoading}
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-[#B5B5B5]" />
                ) : (
                  <Eye className="h-4 w-4 text-[#B5B5B5]" />
                )}
              </Button>
            </div>
            {errors.password && (
              <p className="text-sm text-destructive font-medium">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Remember Me Checkbox */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="rememberMe"
              checked={rememberMe}
              onCheckedChange={(checked) => setValue("rememberMe", checked === true)}
              disabled={isLoading}
              className="border-[#ddd] data-[state=checked]:bg-[#1E5F99] data-[state=checked]:border-[#1E5F99]"
            />
            <Label
              htmlFor="rememberMe"
              className="text-sm text-[#4A4A4A] cursor-pointer"
            >
              Remember me for 30 days
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-[#1E5F99] hover:bg-[#1a5485] text-white font-medium transition-all duration-200 shadow-md hover:shadow-lg"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        {/* Switch to Register */}
        <div className="text-center pt-4 border-t border-[#F5F5F5]">
          <p className="text-sm text-[#4A4A4A]">
            Don't have an account?{" "}
            <Button
              variant="link"
              className="p-0 h-auto text-[#1E5F99] hover:text-[#55ACEE] font-medium underline-offset-4"
              onClick={onSwitchToRegister}
              disabled={isLoading}
            >
              Create one here
            </Button>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};