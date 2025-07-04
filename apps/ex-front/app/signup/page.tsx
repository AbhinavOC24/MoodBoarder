"use client";
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
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface formInterface {
  username: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const router = useRouter();

  const [formData, updateFormData] = useState<formInterface>({
    username: "",
    email: "",
    password: "",
  });

  const [warning, setWarning] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    // Validation
    if (!formData.username || !formData.email || !formData.password) {
      setWarning("All fields are required.");
      return;
    }
    if (formData.username.length < 3 || formData.username.length > 20) {
      setWarning("Username must be between 3 and 20 characters.");
      return;
    }
    if (formData.password.length < 8) {
      setWarning("Password must be at least 8 characters long.");
      return;
    }

    setWarning(null); // clear warnings on valid input

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/signup`,
        formData,
        { withCredentials: true }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("username", response.data.username);
      localStorage.setItem("userId", response.data.userId);
      router.push("/");
    } catch (e: any) {
      console.error("Signup failed", e.response?.data || e.message);
      setWarning("Signup failed. Please try again.");
    }
  }

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
        {/* Background gradient orbs */}
        <div className="absolute top-20 end-1/4 size-64 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 start-1/4 size-64 bg-blue-500/10 rounded-full blur-3xl"></div>

        <Card className="w-full max-w-md bg-zinc-900/80 backdrop-blur-sm border-zinc-800 relative z-10">
          <form onSubmit={handleSubmit}>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Create an account
              </CardTitle>
              <CardDescription className="text-center text-zinc-400">
                Enter your details to start using SketchSpace
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-zinc-200"
                >
                  Username
                </label>
                <Input
                  id="username"
                  name="username"
                  placeholder="John"
                  value={formData.username}
                  onChange={(e) =>
                    updateFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="bg-zinc-800/50 placeholder:text-gray-500 border-zinc-700 text-white focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
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
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={(e) =>
                    updateFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="bg-zinc-800/50 border-zinc-700 placeholder:text-gray-500 text-white focus:border-purple-500 focus:ring-purple-500/20"
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
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) =>
                    updateFormData({
                      ...formData,
                      [e.target.name]: e.target.value,
                    })
                  }
                  className="bg-zinc-800/50 border-zinc-700 placeholder:text-gray-500 text-white focus:border-purple-500 focus:ring-purple-500/20"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Button className="w-full bg-purple-600 cursor-pointer hover:bg-purple-700 text-white">
                Create Account
              </Button>
              {warning && (
                <p className="text-red-400 text-sm text-center">{warning}</p>
              )}
              <div className="text-center text-sm text-zinc-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-purple-400 hover:text-purple-300"
                >
                  Login
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
