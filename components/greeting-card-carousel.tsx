"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User } from "@/types";
import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import HeroGrid from "./ui/grid";
import FlippableCard from "./ui/flip-card";

interface GreetingCardCarouselProps {
  users: User[];
  username: string;
}

export default function GreetingCardCarousel({
  users,
  username,
}: GreetingCardCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedHero, setSelectedHero] = useState<User | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isHovered, setIsHovered] = useState(false); // Track hover state

  // Track previous user ID to prevent unwanted resets
  const previousUser = useRef(users[index]?.id);

  useEffect(() => {
    if (previousUser.current !== users[index]?.id) {
      previousUser.current = users[index]?.id;
      // Do NOT reset `isFlipped`, so the side stays consistent across users
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // Navigation Functions
  const nextSlide = useCallback(() => {
    setDirection(1);
    setIndex((prevIndex) => (prevIndex + 1) % users.length);
  }, [users.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setIndex((prevIndex) => (prevIndex - 1 + users.length) % users.length);
  }, [users.length]);

  // ✅ Close carousel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectedHero &&
        !(event.target as HTMLElement).closest(".carousel-container")
      ) {
        setSelectedHero(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [selectedHero]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedHero) {
        if (event.key === "ArrowLeft") prevSlide();
        if (event.key === "ArrowRight") nextSlide();
        if (event.key === "Escape") setSelectedHero(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, prevSlide, selectedHero]);

  return (
    <div className="w-full mx-auto bg-page bg-cover bg-right-bottom">
      <HeroGrid
        users={users}
        onSelectHero={(user) => {
          setSelectedHero(user);
          setIndex(users.findIndex((u) => u.id === user.id));
        }}
      />

      <AnimatePresence>
        {selectedHero && (
          <motion.div
            className="fixed inset-0 flex justify-center bg-black bg-opacity-70 items-center h-screen overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`hero-${selectedHero.id}`}
              className="carousel-container relative w-full max-w-3xl h-full justify-center items-center max-h-screen rounded-lg p-6 shadow-lg flex flex-col"
            >
              {/* 🚀 **Carousel Wrapper** */}
              <div className="relative h-full w-full flex justify-center items-center">
                <AnimatePresence
                  mode="popLayout"
                  initial={false}
                  custom={direction}
                >
                  <motion.div
                    key={users[index].id}
                    className="absolute w-full h-full  flex flex-col justify-center items-center bg-heroBlack"
                    initial={{ opacity: 0, x: direction * 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -50 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                  >
                    {/* Flippable Card Component */}
                    <FlippableCard
                      user={users[index]}
                      isFlipped={isFlipped}
                      username={username}
                      shouldAnimate={previousUser.current === users[index].id}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 🔄 **Flip Button with Tooltip** */}
              <div
                className="absolute top-8 right-10"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <button
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="bg-heroYellow text-black p-3 rounded-full shadow-lg hover:bg-yellow-400 transition"
                >
                  <RotateCw className="w-10 h-10" />
                </button>

                {/* Tooltip */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full mt-2 left-1/2 -translate-x-1/2 bg-heroDark text-white text-lg px-3 py-1 rounded-lg shadow-lg"
                    >
                      {!isFlipped ? `Flip to Messages` : `Flip to Info`}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* **Navigation Buttons** */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-heroRed text-white p-3 rounded-full shadow-lg hover:bg-heroYellow transition"
              >
                <ArrowLeft className="w-8 h-8" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-heroRed text-white p-3 rounded-full shadow-lg hover:bg-heroYellow transition"
              >
                <ArrowRight className="w-8 h-8" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
