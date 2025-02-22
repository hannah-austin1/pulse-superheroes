"use client";

import { motion } from "framer-motion";
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
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 p-6"
    >
      {users.map((user) => (
        <motion.div
          key={user.id}
          layoutId={`hero-${user.id}`}
          className="cursor-pointer"
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
          <p className="text-center text-white font-bold mt-2">{user.name}</p>
        </motion.div>
      ))}
    </motion.div>
  );
}
