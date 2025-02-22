"use client";
import { motion } from "motion/react";
import HeroHeader from "./header";
import { useState } from "react";
import { setUsername } from "@/app/actions";

export default function Splash() {
  const [inputValue, setInputValue] = useState("");

  // ✅ Handle username submission
  const handleStart = () => {
    if (inputValue.trim()) {
      setUsername(inputValue.trim());
    }
  };
  return (
    <motion.div
      className="fixed inset-0 flex flex-col items-center justify-center h-full w-full bg-heroRed bg-opacity-90 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <HeroHeader />
      <motion.div
        className="p-6 bg-white border-4 border-black shadow-[6px_6px_0px_black]   rounded-lg text-center mt-6"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
      >
        <h2 className="text-6xl font-bold font-hero uppercase text-yellow-400 text-center tracking-wide drop-shadow-[3px_3px_0px_black]">
          Welcome, Hero!
        </h2>
        <p className="text-lg text-gray-700 mt-2">
          Enter your name to continue:
        </p>
        <input
          type="text"
          className="mt-4 p-3 w-full text-black rounded-lg border-2 border-heroYellow outline-none focus:ring-2 focus:ring-heroRed"
          placeholder="Your Hero Name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button
          onClick={handleStart}
          className="mt-4 px-6 py-3 bg-heroRed text-white font-bold rounded-full shadow-lg hover:bg-heroYellow hover:text-black transition"
        >
          Start
        </button>
      </motion.div>
    </motion.div>
  );
}
