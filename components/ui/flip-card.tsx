import { motion } from "motion/react";
import { Card, CardContent } from "./card";
import CommentsSection from "./comments";
import Image from "next/image";
import DownloadButton from "./download-button";
import { User } from "@/types";

export default function FlippableCard({
  user,
  isFlipped,
  username,
  shouldAnimate,
}: {
  user: User;
  isFlipped: boolean;
  shouldAnimate: boolean;
  username: string;
}) {
  console.log({ shouldAnimate });
  return (
    <Card
      className="hero-card relative w-full h-full shadow-xl flex flex-col
    before:absolute before:inset-0 before:bg-[radial-gradient(circle,yellow_20%,orange_40%,red_60%)] before:opacity-50 before:pointer-events-none
    after:absolute after:inset-0 after:bg-[radial-gradient(circle,rgba(255,255,255,0.2)_2px,black_3px)] after:bg-[size:12px_12px] after:opacity-30 after:pointer-events-none"
    >
      <CardContent className="flex flex-col items-center justify-start h-full w-full z-40 overflow-scroll">
        <div className="flex flex-col w-full items-center mb-4">
          <h1 className="text-5xl font-bold font-hero uppercase text-yellow-400 text-center tracking-wide drop-shadow-[3px_3px_0px_black]">
            {user.name}
          </h1>
        </div>

        {/* **Flipping Content** */}
        <motion.div className="relative w-full h-full">
          {/* **Front Side (Hero Info)** */}
          <motion.div
            className="absolute w-full h-full"
            animate={{ rotateY: isFlipped ? 0 : 180 }}
            style={{ backfaceVisibility: "hidden" }}
            transition={{ duration: shouldAnimate ? 0.7 : 0 }}
          >
            <CardContent className="flex flex-col p-3 gap-5 w-full h-full items-center rounded-lg border-4 border-black shadow-[6px_6px_0px_black] bg-white overflow-scroll">
              <div className="flex justify-center flex-wrap gap-2 mt-3">
                <DownloadButton user={user} type="pdf" />
                <DownloadButton user={user} type="icon" />
              </div>
              <div className="w-full flex justify-center">
                <Image
                  src={`${process.env.NEXT_PUBLIC_IMAGE_ENDPOINT}/${
                    user.name.split(" ")[0]
                  }.png`}
                  alt={`Hero ${user.name}`}
                  width={250}
                  height={250}
                  className="rounded-lg border-[6px] border-heroRed shadow-[4px_4px_0px_black] bg-heroYellow p-2"
                />
              </div>

              <div className="w-full h-auto flex flex-col text-white justify-center space-y-4 text-lg p-6 font-bold uppercase">
                <p className="bg-heroYellow px-3 py-1 rounded-xl text-center shadow-[3px_3px_0px_black]">
                  Team: {user.team || "Unknown"}
                </p>
                <p className="bg-heroBlue px-3 py-1 rounded-xl text-center shadow-[3px_3px_0px_black]">
                  Time on Project: {user.time_on_project || "N/A"}
                </p>
                <p className="bg-heroRed px-3 py-1 rounded-xl text-center shadow-[3px_3px_0px_black]">
                  Tickets Worked on: {user.tickets_completed || "N/A"}
                </p>
                <p className="bg-heroDark text-white px-3 py-1 rounded-xl text-center shadow-[3px_3px_0px_black]">
                  Favourite Moment: {user.favourite_moment || "None yet"}
                </p>
              </div>
            </CardContent>
          </motion.div>

          {/* **Back Side (Chat Section)** */}
          <motion.div
            className="absolute w-full h-full"
            initial={{ rotateY: 180 }}
            animate={{ rotateY: isFlipped ? 180 : 0 }}
            style={{ backfaceVisibility: "hidden" }}
            transition={{ duration: shouldAnimate ? 0.7 : 0 }}
          >
            <CardContent className="flex flex-col p-3 gap-5 w-full h-full items-center rounded-lg border-4 border-black shadow-[6px_6px_0px_black] bg-white overflow-hidden">
              <CommentsSection user={user} username={username} />
            </CardContent>
          </motion.div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
