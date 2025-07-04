"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pen } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { useRouter } from "next/navigation";
import axios from "axios";

interface formInterface {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [formData, updateFormData] = useState<formInterface>({
    email: "",
    password: "",
  });
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    // Client-side validation
    if (!formData.email || !formData.password) {
      setError("Please fill in both email and password.");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/login`,
        formData,
        { withCredentials: true }
      );
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("userId", response.data.userId);

      router.push("/");
      // Redirect or show success — for now, just console.log
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <header className="container mx-auto py-6 px-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Pen className="size-6 text-purple-400" />
          <span className="text-xl font-bold">SketchSpace</span>
        </Link>
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            className="text-gray-300 hover:text-white hover:bg-zinc-800"
            asChild
          >
            <Link href="/login">Login</Link>
          </Button>
          <Button
            variant="outline"
            className="border-purple-500 text-purple-400 hover:bg-purple-500/10 bg-transparent"
            asChild
          >
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto flex flex-col items-center justify-center px-4 py-16 relative">
        <div className="absolute top-20 start-1/4 size-64 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 end-1/4 size-64 bg-blue-500/10 rounded-full blur-3xl" />

        <Card className="w-full max-w-md bg-zinc-900/80 backdrop-blur-sm border-zinc-800 relative z-10">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Welcome back
              </CardTitle>
              <CardDescription className="text-center text-zinc-400">
                Enter your credentials to access your account
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {error && (
                <div className="text-sm text-red-400 bg-red-900/30 p-2 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-zinc-200"
                >
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    updateFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  placeholder="name@example.com"
                  required
                  className="bg-zinc-800/50 placeholder:text-gray-500 border-zinc-700 text-white focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-zinc-200"
                >
                  Password
                </label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    updateFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  placeholder="password"
                  required
                  className="bg-zinc-800/50 border-zinc-700 text-white focus:border-purple-500 placeholder:text-gray-500 focus:ring-purple-500/20"
                />
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                disabled={loading}
                className={`w-full cursor-pointer ${
                  loading
                    ? "bg-purple-800 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white`}
              >
                {loading ? "Logging in..." : "Login"}
              </Button>
              <div className="text-center text-sm text-zinc-400">
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Sign up
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </main>

      <footer className="container mx-auto py-8 px-4 border-t border-zinc-900 text-center text-gray-500 text-sm">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Pen className="size-4 text-purple-400" />
          <span className="font-medium text-gray-400">SketchSpace</span>
        </div>
        <p>© {new Date().getFullYear()} SketchSpace. All rights reserved.</p>
      </footer>
    </div>
  );
}
