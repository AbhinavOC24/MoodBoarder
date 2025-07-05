// "use client";
// import Link from "next/link";
// import { Button } from "@/components/ui/button";
// import { Pen, Users, Share2, ChevronRight, Loader2 } from "lucide-react"; // Added Loader2
// import { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { CreateRoomModal } from "@/components/create-room-modal";

// export default function LandingPage() {
//   const router = useRouter();
//   const [loginStatus, updateLoginStatus] = useState<boolean>(false);
//   const [logoutLoading, setLogoutLoading] = useState<boolean>(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) updateLoginStatus(false);
//     else updateLoginStatus(true);
//   }, []);

//   const handleLogOut = async () => {
//     try {
//       setLogoutLoading(true);
//       await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/logout`, {
//         withCredentials: true,
//       });
//       localStorage.removeItem("token");
//       updateLoginStatus(false);
//       router.push("/");
//     } catch (err) {
//       console.error("Logout failed", err);
//       // Optionally: show a toast / error
//     } finally {
//       setLogoutLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
//       <header className="container mx-auto py-6 px-4 flex items-center justify-between">
//         <div className="flex items-center gap-2">
//           <Pen className="size-6 text-purple-400" />
//           <span className="text-xl font-bold">SketchSpace</span>
//         </div>

//         {!loginStatus ? (
//           <div className="flex items-center gap-4">
//             <Button
//               variant="ghost"
//               className="text-gray-300 border hover:text-white hover:bg-zinc-800"
//               asChild
//             >
//               <Link href="/login">Login</Link>
//             </Button>

//             <Button
//               variant="outline"
//               className="border-purple-500 text-purple-400 hover:bg-purple-500/10 bg-transparent"
//               asChild
//             >
//               <Link href="/signup">Sign Up</Link>
//             </Button>
//           </div>
//         ) : (
//           <Button
//             variant="outline"
//             className=" text-white cursor-pointer font-bold hover:bg-purple-500/10"
//             disabled={logoutLoading}
//             onClick={handleLogOut}
//           >
//             {logoutLoading ? (
//               <span className="flex items-center gap-2">
//                 <Loader2 className="size-4 animate-spin" />
//                 Logging out...
//               </span>
//             ) : (
//               "Log Out"
//             )}
//           </Button>
//         )}
//       </header>

//       <main className="flex-1">
//         <section className="container mx-auto px-4 py-16 md:py-24">
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
//             <div className="space-y-8">
//               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
//                 Collaborative whiteboarding{" "}
//                 <span className="text-purple-400">reimagined</span>
//               </h1>
//               <p className="text-lg text-gray-400 max-w-xl">
//                 Create, collaborate, and share diagrams and sketches in
//                 real-time with anyone, anywhere. No learning curve, just pure
//                 creativity.
//               </p>
//               <div className="flex flex-col sm:flex-row gap-4">
//                 {loginStatus ? (
//                   <CreateRoomModal>
//                     <Button
//                       size="lg"
//                       className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white px-8 py-6 text-lg rounded-xl"
//                     >
//                       <span className="flex items-center gap-2">
//                         Create Room
//                         <ChevronRight className="size-5" />
//                       </span>
//                     </Button>
//                   </CreateRoomModal>
//                 ) : (
//                   <Button
//                     size="lg"
//                     className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white px-8 py-6 text-lg rounded-xl"
//                     onClick={() => router.push("/login")}
//                   >
//                     <span className="flex items-center gap-2">
//                       Login to Create or Join Room
//                       <ChevronRight className="size-5" />
//                     </span>
//                   </Button>
//                 )}
//               </div>
//             </div>

//             <div className="relative">
//               <div className="absolute -top-20 -left-20 size-64 bg-purple-500/20 rounded-full blur-3xl"></div>
//               <div className="absolute -bottom-20 -right-20 size-64 bg-blue-500/20 rounded-full blur-3xl"></div>

//               <div className="relative bg-zinc-900 border border-zinc-800 rounded-xl p-4 shadow-xl">
//                 <div className="absolute top-4 left-4 flex gap-2">
//                   <div className="size-3 rounded-full bg-red-500"></div>
//                   <div className="size-3 rounded-full bg-yellow-500"></div>
//                   <div className="size-3 rounded-full bg-green-500"></div>
//                 </div>

//                 <div className="pt-8 pb-4">
//                   <div className="flex justify-center">
//                     <svg
//                       width="400"
//                       height="240"
//                       viewBox="0 0 400 240"
//                       className="max-w-full h-auto"
//                     >
//                       <rect
//                         x="10"
//                         y="10"
//                         width="380"
//                         height="220"
//                         rx="4"
//                         fill="#1a1a1a"
//                       />
//                       <circle
//                         cx="120"
//                         cy="80"
//                         r="30"
//                         fill="none"
//                         stroke="#6366f1"
//                         strokeWidth="2"
//                       />
//                       <rect
//                         x="220"
//                         y="50"
//                         width="80"
//                         height="60"
//                         rx="2"
//                         fill="none"
//                         stroke="#ec4899"
//                         strokeWidth="2"
//                       />
//                       <path
//                         d="M120 110 L220 80"
//                         stroke="#10b981"
//                         strokeWidth="2"
//                       />
//                       <path
//                         d="M220 110 L180 160"
//                         stroke="#f59e0b"
//                         strokeWidth="2"
//                       />
//                       <path
//                         d="M120 110 L80 160"
//                         stroke="#f59e0b"
//                         strokeWidth="2"
//                       />
//                       <rect
//                         x="60"
//                         y="160"
//                         width="40"
//                         height="30"
//                         rx="2"
//                         fill="none"
//                         stroke="#6366f1"
//                         strokeWidth="2"
//                       />
//                       <rect
//                         x="160"
//                         y="160"
//                         width="40"
//                         height="30"
//                         rx="2"
//                         fill="none"
//                         stroke="#6366f1"
//                         strokeWidth="2"
//                       />

//                       <g transform="translate(250, 140)">
//                         <path d="M0,0 L10,16 L4,16 L0,24 Z" fill="white" />
//                       </g>

//                       <g transform="translate(150, 70)">
//                         <circle cx="0" cy="0" r="4" fill="#f97316" />
//                         <text x="8" y="4" fontSize="10" fill="#f97316">
//                           User 1
//                         </text>
//                       </g>
//                       <g transform="translate(280, 120)">
//                         <circle cx="0" cy="0" r="4" fill="#06b6d4" />
//                         <text x="8" y="4" fontSize="10" fill="#06b6d4">
//                           User 2
//                         </text>
//                       </g>
//                     </svg>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </section>

//         <section className="container mx-auto px-4 py-16 border-t border-zinc-900">
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
//             <div className="bg-zinc-900/50 p-6 rounded-xl">
//               <div className="bg-purple-500/10 p-3 rounded-lg w-fit mb-4">
//                 <Pen className="size-6 text-purple-400" />
//               </div>
//               <h3 className="text-xl font-medium mb-2">Intuitive Drawing</h3>
//               <p className="text-gray-400">
//                 Simple tools for sketching ideas quickly and efficiently.
//               </p>
//             </div>
//             <div className="bg-zinc-900/50 p-6 rounded-xl">
//               <div className="bg-blue-500/10 p-3 rounded-lg w-fit mb-4">
//                 <Users className="size-6 text-blue-400" />
//               </div>
//               <h3 className="text-xl font-medium mb-2">
//                 Real-time Collaboration
//               </h3>
//               <p className="text-gray-400">
//                 Work together with your team seamlessly in real-time.
//               </p>
//             </div>
//             <div className="bg-zinc-900/50 p-6 rounded-xl">
//               <div className="bg-green-500/10 p-3 rounded-lg w-fit mb-4">
//                 <Share2 className="size-6 text-green-400" />
//               </div>
//               <h3 className="text-xl font-medium mb-2">Instant Sharing</h3>
//               <p className="text-gray-400">
//                 Share your creations with a simple link, no sign-up required.
//               </p>
//             </div>
//           </div>
//         </section>
//       </main>

//       <footer className="container mx-auto py-8 px-4 border-t border-zinc-900 text-center text-gray-500 text-sm">
//         <div className="flex justify-center items-center gap-2 mb-4">
//           <Pen className="size-4 text-purple-400" />
//           <span className="font-medium text-gray-400">SketchSpace</span>
//         </div>
//         <p>© {new Date().getFullYear()} SketchSpace. All rights reserved.</p>
//       </footer>
//     </div>
//   );
// }

"use client";

import type React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Pen,
  Users,
  Share2,
  ChevronRight,
  Loader2,
  X,
  LinkIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { CreateRoomModal } from "@/components/create-room-modal";

export default function LandingPage() {
  const router = useRouter();
  const [loginStatus, updateLoginStatus] = useState<boolean>(false);
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const [isJoinModalOpen, setIsJoinModalOpen] = useState<boolean>(false);
  const [roomLink, setRoomLink] = useState<string>("");
  const [joinRoomLoading, setJoinRoomLoading] = useState<boolean>(false);

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

  const handleJoinRoom = async () => {
    if (!roomLink.trim()) return;

    try {
      setJoinRoomLoading(true);

      console.log("Joining room with link:", roomLink);
      setIsJoinModalOpen(false);
      setRoomLink("");

      // Navigate to the room
      router.push(roomLink);
    } catch (err) {
      console.error("Failed to join room", err);
    } finally {
      setJoinRoomLoading(false);
    }
  };

  const handleJoinKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleJoinRoom();
    }
  };

  const openJoinModal = () => setIsJoinModalOpen(true);
  const closeJoinModal = () => {
    setIsJoinModalOpen(false);
    setRoomLink("");
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
              className="text-gray-300 border hover:text-white hover:bg-zinc-800"
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
            className=" text-white cursor-pointer font-bold hover:bg-purple-500/10 bg-transparent"
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
                  <>
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
                    <Button
                      variant="outline"
                      size="lg"
                      className="border-zinc-700 text-gray-300 hover:bg-zinc-800 px-8 py-6 text-lg rounded-xl bg-transparent"
                      onClick={openJoinModal}
                    >
                      <span className="flex items-center gap-2">
                        Join Room
                        <LinkIcon className="size-5" />
                      </span>
                    </Button>
                  </>
                ) : (
                  <Button
                    size="lg"
                    className="bg-purple-600 hover:bg-purple-700 cursor-pointer text-white px-8 py-6 text-lg rounded-xl"
                    onClick={() => router.push("/login")}
                  >
                    <span className="flex items-center gap-2">
                      Login to Create or Join Room
                      <ChevronRight className="size-5" />
                    </span>
                  </Button>
                )}
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

      {/* Join Room Modal */}
      {isJoinModalOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 bg-black/80"
            onClick={closeJoinModal}
          />

          {/* Modal Content */}
          <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-zinc-900 border-zinc-800 p-6 shadow-lg sm:rounded-lg text-white">
            {/* Close Button */}
            <button
              onClick={closeJoinModal}
              className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>

            {/* Header */}
            <div className="flex flex-col space-y-1.5 text-center sm:text-left">
              <h2 className="text-xl font-bold text-center text-white">
                Join Room
              </h2>
              <p className="text-center text-zinc-400">
                Paste the room link here to join the collaborative session
              </p>
            </div>

            {/* Form */}
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label
                  htmlFor="roomLink"
                  className="text-sm font-medium text-zinc-200"
                >
                  Room Link
                </label>
                <Input
                  id="roomLink"
                  placeholder="https://sketchspace.com/room/..."
                  value={roomLink}
                  onChange={(e) => setRoomLink(e.target.value)}
                  onKeyPress={handleJoinKeyPress}
                  className="bg-zinc-800/50 border-zinc-700 text-white focus:border-purple-500 focus:ring-purple-500/20"
                  autoFocus
                  disabled={joinRoomLoading}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={closeJoinModal}
                className="border-zinc-700 text-gray-300 hover:bg-zinc-800 bg-transparent"
                disabled={joinRoomLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleJoinRoom}
                disabled={!roomLink.trim() || joinRoomLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {joinRoomLoading ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="size-4 animate-spin" />
                    Joining...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Join Room
                    <LinkIcon className="size-4" />
                  </span>
                )}
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
