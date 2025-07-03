"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Pen, Users, Share2, ChevronRight, Loader2 } from "lucide-react"; // Added Loader2
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CreateRoomModal } from "@/components/create-room-modal";

export default function LandingPage() {
  const router = useRouter();
  const [loginStatus, updateLoginStatus] = useState<boolean>(false);
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) updateLoginStatus(false);
    else updateLoginStatus(true);
  }, []);

  const handleLogOut = async () => {
    try {
      setLogoutLoading(true);
      await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
        withCredentials: true,
      });
      localStorage.removeItem("token");
      updateLoginStatus(false);
      router.push("/");
    } catch (err) {
      console.error("Logout failed", err);
      // Optionally: show a toast / error
    } finally {
      setLogoutLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      <header className="container mx-auto py-6 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Pen className="size-6 text-purple-400" />
          <span className="text-xl font-bold">SketchSpace</span>
        </div>

        {!loginStatus ? (
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
        ) : (
          <Button
            variant="outline"
            className="bg-purple-400 text-black font-bold hover:bg-purple-500/10"
            disabled={logoutLoading}
            onClick={handleLogOut}
          >
            {logoutLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="size-4 animate-spin" />
                Logging out...
              </span>
            ) : (
              "Log Out"
            )}
          </Button>
        )}
      </header>

      <main className="flex-1">
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                Collaborative whiteboarding{" "}
                <span className="text-purple-400">reimagined</span>
              </h1>
              <p className="text-lg text-gray-400 max-w-xl">
                Create, collaborate, and share diagrams and sketches in
                real-time with anyone, anywhere. No learning curve, just pure
                creativity.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                {loginStatus ? (
                  <CreateRoomModal>
                    <Button
                      size="lg"
                      className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white px-8 py-6 text-lg rounded-xl"
                    >
                      <span className="flex items-center gap-2">
                        Create Room
                        <ChevronRight className="size-5" />
                      </span>
                    </Button>
                  </CreateRoomModal>
                ) : (
                  <Button
                    variant="ghost"
                    className="text-white cursor-pointer"
                    asChild
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                )}

                <Button
                  variant="outline"
                  size="lg"
                  className="border-zinc-700 text-gray-300 hover:bg-zinc-800 px-8 py-6 text-lg rounded-xl bg-transparent"
                >
                  <Link href="/examples" className="flex items-center gap-2">
                    See Examples
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -top-20 -left-20 size-64 bg-purple-500/20 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -right-20 size-64 bg-blue-500/20 rounded-full blur-3xl"></div>

              <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl">
                <div className="absolute top-4 left-4 flex gap-2">
                  <div className="size-3 rounded-full bg-red-500"></div>
                  <div className="size-3 rounded-full bg-yellow-500"></div>
                  <div className="size-3 rounded-full bg-green-500"></div>
                </div>

                <div className="pt-8 pb-4">
                  <div className="flex justify-center">
                    <svg
                      width="400"
                      height="240"
                      viewBox="0 0 400 240"
                      className="max-w-full h-auto"
                    >
                      <rect
                        x="10"
                        y="10"
                        width="380"
                        height="220"
                        rx="4"
                        fill="#1a1a1a"
                      />
                      <circle
                        cx="120"
                        cy="80"
                        r="30"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2"
                      />
                      <rect
                        x="220"
                        y="50"
                        width="80"
                        height="60"
                        rx="2"
                        fill="none"
                        stroke="#ec4899"
                        strokeWidth="2"
                      />
                      <path
                        d="M120 110 L220 80"
                        stroke="#10b981"
                        strokeWidth="2"
                      />
                      <path
                        d="M220 110 L180 160"
                        stroke="#f59e0b"
                        strokeWidth="2"
                      />
                      <path
                        d="M120 110 L80 160"
                        stroke="#f59e0b"
                        strokeWidth="2"
                      />
                      <rect
                        x="60"
                        y="160"
                        width="40"
                        height="30"
                        rx="2"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2"
                      />
                      <rect
                        x="160"
                        y="160"
                        width="40"
                        height="30"
                        rx="2"
                        fill="none"
                        stroke="#6366f1"
                        strokeWidth="2"
                      />

                      <g transform="translate(250, 140)">
                        <path d="M0,0 L10,16 L4,16 L0,24 Z" fill="white" />
                      </g>

                      <g transform="translate(150, 70)">
                        <circle cx="0" cy="0" r="4" fill="#f97316" />
                        <text x="8" y="4" fontSize="10" fill="#f97316">
                          User 1
                        </text>
                      </g>
                      <g transform="translate(280, 120)">
                        <circle cx="0" cy="0" r="4" fill="#06b6d4" />
                        <text x="8" y="4" fontSize="10" fill="#06b6d4">
                          User 2
                        </text>
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16 border-t border-zinc-900">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/50 p-6 rounded-xl">
              <div className="bg-purple-500/10 p-3 rounded-lg w-fit mb-4">
                <Pen className="size-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Intuitive Drawing</h3>
              <p className="text-gray-400">
                Simple tools for sketching ideas quickly and efficiently.
              </p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-xl">
              <div className="bg-blue-500/10 p-3 rounded-lg w-fit mb-4">
                <Users className="size-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">
                Real-time Collaboration
              </h3>
              <p className="text-gray-400">
                Work together with your team seamlessly in real-time.
              </p>
            </div>
            <div className="bg-zinc-900/50 p-6 rounded-xl">
              <div className="bg-green-500/10 p-3 rounded-lg w-fit mb-4">
                <Share2 className="size-6 text-green-400" />
              </div>
              <h3 className="text-xl font-medium mb-2">Instant Sharing</h3>
              <p className="text-gray-400">
                Share your creations with a simple link, no sign-up required.
              </p>
            </div>
          </div>
        </section>
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
