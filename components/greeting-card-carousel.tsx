"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { User } from "@/types";
import DownloadButton from "@/components/ui/download-button";
import { ArrowLeft, ArrowRight, RotateCw } from "lucide-react";
import HeroGrid from "./ui/grid";
import CommentsSection from "./ui/comments";

interface GreetingCardCarouselProps {
  users: User[];
}

export default function GreetingCardCarousel({
  users,
}: GreetingCardCarouselProps) {
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [selectedHero, setSelectedHero] = useState<User | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);

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
  }, [selectedHero]);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prevIndex) => (prevIndex + 1) % users.length);
    setIsFlipped(false);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prevIndex) => (prevIndex - 1 + users.length) % users.length);
    setIsFlipped(false);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {!selectedHero && (
        <HeroGrid
          users={users}
          onSelectHero={(user) => {
            setSelectedHero(user);
            setIndex(users.findIndex((u) => u.id === user.id));
          }}
        />
      )}

      <AnimatePresence>
        {selectedHero && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 h-screen overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`hero-${selectedHero.id}`}
              className="carousel-container relative w-full max-w-6xl h-full max-h-screen rounded-lg p-6 shadow-lg flex flex-col"
            >
              {/* 🚀 **Carousel Wrapper** */}
              <div className="relative w-full h-full flex justify-center items-center">
                <AnimatePresence
                  mode="popLayout"
                  initial={false}
                  custom={direction}
                >
                  <motion.div
                    key={users[index].id}
                    className="absolute w-full h-full max-w-xl flex flex-col justify-center items-center bg-heroBlack"
                    initial={{ opacity: 0, x: direction * 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: direction * -50 }}
                    transition={{ type: "spring", bounce: 0.4 }}
                  >
                    {/* 🚀 **Flip Card Wrapper** */}
                    <motion.div
                      className="relative w-full h-full"
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                      style={{ transformStyle: "preserve-3d" }}
                    >
                      {/* **Front Side (Hero Info)** */}
                      <motion.div
                        className={`absolute w-full h-full flex flex-col justify-center items-center`}
                        style={{ backfaceVisibility: "hidden" }}
                      >
                        <Card
                          className="hero-card relative w-full h-full shadow-xl flex flex-col
    before:absolute before:inset-0 before:bg-[radial-gradient(circle,yellow_20%,orange_40%,red_60%)] before:opacity-50 before:pointer-events-none
    after:absolute after:inset-0 after:bg-[radial-gradient(circle,rgba(255,255,255,0.2)_2px,black_3px)] after:bg-[size:12px_12px] after:opacity-30 after:pointer-events-none"
                        >
                          <CardContent className="flex flex-col items-center justify-start h-full w-full z-40 overflow-scroll">
                            {/* Name & Buttons */}
                            <div className="flex flex-col w-full items-center mb-4">
                              <p className="text-6xl font-bold font-hero uppercase text-yellow-400 text-center tracking-wide drop-shadow-[3px_3px_0px_black]">
                                {users[index].name}
                              </p>
                            </div>

                            {/* Hero Image & Stats Section */}
                            <CardContent
                              className="flex flex-col p-3 gap-5 w-full items-center rounded-lg border-4 border-black shadow-[6px_6px_0px_black] bg-white relative
    before:absolute before:inset-0 before:bg-[radial-gradient(circle,rgba(255,0,0,0.2)_2px,transparent_2px)] before:bg-[size:12px_12px] before:opacity-50 before:pointer-events-none"
                            >
                              <div className="flex justify-center flex-wrap gap-2 mt-3">
                                <DownloadButton
                                  user={users[index]}
                                  type="pdf"
                                />
                                <DownloadButton
                                  user={users[index]}
                                  type="icon"
                                />
                              </div>
                              <div className="w-full flex justify-center">
                                <Image
                                  src={`${
                                    process.env.NEXT_PUBLIC_IMAGE_ENDPOINT
                                  }/${users[index].name.split(" ")[0]}.png`}
                                  alt={`Hero ${users[index].name}`}
                                  width={250}
                                  height={250}
                                  className="rounded-lg border-[6px] border-heroRed shadow-[4px_4px_0px_black] bg-yellow-400 p-2"
                                />
                              </div>

                              <div className="w-full h-auto flex flex-col text-white justify-center space-y-4 text-lg p-6 font-bold uppercase">
                                <p className="bg-heroYellow px-3 py-1 rounded-xl text-center shadow-[3px_3px_0px_black]">
                                  Team: {users[index].team || "Unknown"}
                                </p>
                                <p className="bg-heroBlue px-3 py-1 rounded-xl text-center shadow-[3px_3px_0px_black]">
                                  Time on Project:{" "}
                                  {users[index].time_on_project || "N/A"}
                                </p>
                                <p className="bg-heroRed px-3 py-1 rounded-xl text-center shadow-[3px_3px_0px_black]">
                                  Tickets Worked on:{" "}
                                  {users[index].tickets_completed || "N/A"}
                                </p>
                                <p className="bg-heroDark text-white px-3 py-1 rounded-xl text-center shadow-[3px_3px_0px_black]">
                                  Favourite Moment:{" "}
                                  {users[index].favourite_moment || "None yet"}
                                </p>
                              </div>
                            </CardContent>
                          </CardContent>
                        </Card>
                      </motion.div>

                      {/* **Back Side (Chat) - Fixed Mirror Effect** */}
                      <motion.div
                        className="absolute w-full h-full flex justify-center items-center bg-black"
                        style={{
                          transform: "rotateY(180deg)",
                          backfaceVisibility: "hidden",
                        }}
                      >
                        <Card className="hero-card w-full h-full overflow-hidden shadow-xl flex flex-col">
                          <CommentsSection user={users[index]} />
                        </Card>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 🔄 **Flip Button** */}
              <button
                onClick={() => setIsFlipped(!isFlipped)}
                className="absolute top-3 right-3 bg-heroYellow text-black p-3 rounded-full shadow-lg hover:bg-yellow-400 transition"
              >
                <RotateCw className="w-6 h-6" />
              </button>

              {/* **Navigation Buttons** */}
              <button
                onClick={prevSlide}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-heroRed text-white p-3 rounded-full shadow-lg hover:bg-heroYellow transition"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-heroRed text-white p-3 rounded-full shadow-lg hover:bg-heroYellow transition"
              >
                <ArrowRight className="w-6 h-6" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
