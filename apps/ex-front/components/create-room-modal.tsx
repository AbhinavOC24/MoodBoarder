"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import { ChevronRight, Loader2 } from "lucide-react";
import axios from "axios";

interface CreateRoomModalProps {
  children: React.ReactNode;
}

export function CreateRoomModal({ children }: CreateRoomModalProps) {
  const [slug, setSlug] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isRoomNameValid = slug.trim().length >= 3 && slug.trim().length <= 20;

  const handleCreateRoom = async () => {
    if (!isRoomNameValid) return;

    setIsLoading(true);

    try {
      console.log("Creating room:", slug);
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/create-room`,
        { slug },
        { withCredentials: true }
      );
      console.log(response);
      setIsOpen(false);
      setSlug("");
    } catch (e: any) {
      console.log("Error from create-room-modal", e.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const openModal = () => setIsOpen(true);
  const closeModal = () => {
    setIsOpen(false);
    setSlug("");
    setIsLoading(false);
  };

  return (
    <>
      <div onClick={openModal} className="cursor-pointer">
        {children}
      </div>

      {isOpen && (
        <>
          <DialogOverlay onClick={closeModal} />
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
            <DialogClose onClick={closeModal} />
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-center text-white">
                Create New Room
              </DialogTitle>
              <DialogDescription className="text-center text-zinc-400">
                Enter a name (3 to 20 characters) for your collaborative drawing
                room
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label
                  htmlFor="slug"
                  className="text-sm font-medium text-zinc-200"
                >
                  Room Name
                </label>
                <Input
                  id="slug"
                  placeholder="Enter room name..."
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="bg-zinc-800/50 border-zinc-700 text-white focus:border-purple-500 focus:ring-purple-500/20"
                  autoFocus
                />
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                variant="outline"
                onClick={closeModal}
                className="border-zinc-700 cursor-pointer text-gray-300 hover:bg-zinc-800 bg-transparent"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateRoom}
                disabled={!isRoomNameValid || isLoading}
                className="bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <span className="flex items-center gap-2">
                    Create Room
                    <ChevronRight className="size-4" />
                  </span>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </>
      )}
    </>
  );
}
