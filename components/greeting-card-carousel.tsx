"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { User } from "@/types";
import DownloadButton from "@/components/ui/download-button";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
  const cardRef = useRef<HTMLDivElement>(null); // ✅ Track the card container

  // ✅ Scroll to the top of the card when switching slides
  useEffect(() => {
    if (cardRef.current) {
      cardRef.current.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [index]);

  const nextSlide = () => {
    setDirection(1);
    setIndex((prevIndex) => (prevIndex + 1) % users.length);
  };

  const prevSlide = () => {
    setDirection(-1);
    setIndex((prevIndex) => (prevIndex - 1 + users.length) % users.length);
  };

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

  // ✅ Keyboard navigation
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedHero]);

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
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50 h-screen overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              layoutId={`hero-${selectedHero.id}`}
              className="carousel-container relative w-full max-w-5xl h-full max-h-screen bg-black rounded-lg p-6 shadow-lg flex flex-col overflow-y-auto"
            >
              {/* 🚀 Animated Carousel Container */}
              <div className="relative w-full h-full flex flex-col justify-center items-center">
                <AnimatePresence
                  mode="popLayout"
                  initial={false}
                  custom={direction}
                >
                  <motion.div
                    key={users[index].id}
                    custom={direction}
                    initial={{ opacity: 0, x: direction * 50 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      transition: {
                        delay: 0.2,
                        type: "spring",
                        visualDuration: 0.3,
                        bounce: 0.4,
                      },
                    }}
                    exit={{ opacity: 0, x: direction * -50 }}
                    className="absolute w-full flex justify-center items-center"
                  >
                    {/* Card Component */}
                    <Card
                      ref={cardRef} // ✅ Assign ref to track scrolling
                      className="hero-card w-full h-full max-h-screen overflow-y-auto shadow-xl flex flex-col"
                    >
                      <CardContent className="flex flex-col items-center justify-start h-full w-full overflow-y-auto p-3">
                        {/* Name + Buttons */}
                        <div className="flex flex-row items-center w-full justify-between h-20 flex-shrink-0 mb-3">
                          <p className="text-5xl font-hero text-heroYellow drop-shadow-md whitespace-nowrap">
                            {users[index].name}
                          </p>
                          <div className="flex justify-end flex-wrap gap-2">
                            <DownloadButton user={users[index]} type="pdf" />
                            <DownloadButton user={users[index]} type="icon" />
                          </div>
                        </div>

                        {/* Hero Image & Stats Section */}
                        <CardContent className="flex flex-col md:flex-row p-0 gap-5 w-full h-auto">
                          {/* Hero Image */}
                          <div className="w-full md:w-5/12 h-[300px]">
                            <Image
                              src={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/${
                                users[index].name.split(" ")[0]
                              }.png`}
                              alt={`Hero ${users[index].name}`}
                              width={300}
                              height={300}
                              className="w-full h-full object-cover rounded-lg border-4 border-heroRed shadow-heroGlow"
                            />
                          </div>

                          {/* Stats Section */}
                          <div className="w-full md:w-7/12 h-auto flex flex-col justify-center text-white space-y-4 text-lg rounded-lg border-4 border-heroRed shadow-heroGlow p-3 pt-6">
                            <p>
                              <strong className="text-heroYellow">Team:</strong>{" "}
                              {users[index].team || "Unknown"}
                            </p>
                            <p>
                              <strong className="text-heroYellow">
                                Time on Project:
                              </strong>{" "}
                              {users[index].time_on_project || "N/A"}
                            </p>
                            <p>
                              <strong className="text-heroYellow">
                                Tickets Worked on:
                              </strong>{" "}
                              {users[index].tickets_completed || "N/A"}
                            </p>
                            <p>
                              <strong className="text-heroYellow">
                                Favorite Moment:
                              </strong>{" "}
                              {users[index].favourite_moment || "None yet"}
                            </p>
                          </div>
                        </CardContent>

                        {/* Comments Section */}
                        <div className="w-full text-center flex flex-col flex-grow mt-4">
                          <CommentsSection user={users[index]} />
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* 🚀 Navigation Arrows */}
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
