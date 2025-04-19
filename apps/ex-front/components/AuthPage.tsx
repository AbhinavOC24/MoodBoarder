"use client";

import React from "react";

function AuthPage({ isSignin }: { isSignin: boolean }) {
  return (
    <div className="w-screen h-screen flex justify-center items-center bg-black">
      <div className="p-8 bg-zinc-900 rounded-lg shadow-xl w-96 space-y-4">
        <div className="text-2xl font-bold text-white mb-6 text-center">
          {isSignin ? "Sign In" : "Sign Up"}
        </div>
        <input
          type="text"
          placeholder="Email"
          className="w-full px-4 py-2 bg-zinc-800 text-white placeholder-zinc-400 rounded-md focus:outline-none focus:ring-2 focus:white"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-2 bg-zinc-800 text-white placeholder-zinc-400 rounded-md focus:outline-none focus:ring-2 focus:white"
        />
        <button
          onClick={() => {}}
          className="w-full py-2 px-4 bg-white text-black  hover:bg-gray-100 transition-all duration-200 font-medium rounded-md-md"
        >
          {isSignin ? "Sign In" : "Sign Up"}
        </button>
      </div>
    </div>
  );
}

export default AuthPage;
