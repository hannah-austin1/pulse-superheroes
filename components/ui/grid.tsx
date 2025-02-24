"use client";

import { motion } from "motion/react";
import Image from "next/image";
import { User } from "@/types";

interface HeroGridProps {
  users: User[];
  onSelectHero: (user: User) => void;
}

export default function HeroGrid({ users, onSelectHero }: HeroGridProps) {
  return (
    <motion.div
      layout
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 p-8"
    >
      {users.map((user) => (
        <motion.div
          whileHover={{
            scale: 1.1,
            transition: { duration: 0.3 },
          }}
          key={user.id}
          layoutId={`hero-${user.id}`}
          className="relative cursor-pointer overflow-hidden rounded-lg"
          onClick={() => onSelectHero(user)}
        >
          <Image
            src={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/${
              user.name.split(" ")[0]
            }.png`}
            alt={user.name}
            width={150}
            height={150}
            className="w-full h-auto rounded-lg border-4 border-heroYellow shadow-heroGlow"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity duration-300">
            <p className="flex text-center text-white font-bold text-lg drop-shadow-[3px_3px_0px_black] p-3">
              {user.name}
            </p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
