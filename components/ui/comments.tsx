"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { addComment } from "@/app/actions"; // ✅ Connects to DB
import { User, Comment } from "@/types";
import { CardContent } from "./card";

interface CommentsSectionProps {
  user: User;
  username: string;
}

export default function CommentsSection({
  user,
  username,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(user.comments || []);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setComments(user.comments || []);
  }, [user.comments]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    startTransition(async () => {
      const result = await addComment(user.id, username, newMessage);
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);

        setComments((prev) => [
          ...prev,
          {
            id: String(Date.now()),
            name: username,
            content: newMessage,
          } as Comment,
        ]);

        setNewMessage("");

        setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          100
        );
      }
    });
  };

  return (
    <div className="h-full w-full flex flex-col">
      {/* 🔥 Title */}
      <div className="text-center py-2">
        <p className="text-3xl font-bold font-hero uppercase text-yellow-400 text-center tracking-wide drop-shadow-[3px_3px_0px_black]">
          Messages for {user.name}
        </p>
      </div>

      {/* ✅ Chat Messages Container */}
      <CardContent
        className="flex flex-col flex-grow p-3 w-full rounded-lg border-4 border-black shadow-[6px_6px_0px_black] bg-white relative
        before:absolute before:inset-0 before:bg-[radial-gradient(circle,rgba(255,0,0,0.2)_2px,transparent_2px)] before:bg-[size:12px_12px] before:opacity-50 before:pointer-events-none"
        style={{ maxHeight: "75vh" }}
      >
        <div className="flex flex-col flex-grow overflow-y-auto space-y-2">
          <AnimatePresence initial={false}>
            {comments.length > 0 ? (
              comments.map((comment) => {
                const isMe =
                  username &&
                  comment &&
                  comment?.name?.toLowerCase() === username.toLowerCase();

                console.log({ isMe });
                return (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, x: isMe ? 50 : -50, scale: 0.8 }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                      transition: { duration: 0.5 },
                    }}
                    exit={{
                      opacity: 0,
                      scale: 0.5,
                      transition: { duration: 0.3 },
                    }}
                    className={`w-fit max-w-[90%] p-3 rounded-lg border-black shadow-[3px_3px_0px_black] text-white ${
                      isMe ? "bg-heroBlue self-end" : "bg-heroYellow self-start"
                    }`}
                  >
                    <strong className="text-white">{comment.name}:</strong>{" "}
                    {comment.content}
                  </motion.div>
                );
              })
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.3 } }}
                exit={{ opacity: 0 }}
                className="text-gray-400 text-center font-bold"
              >
                No heroic messages yet. Be the first!
              </motion.p>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        {/* ✅ Chat Input Box */}
        <div className="flex flex-col gap-2 pt-3 border-t-2 border-gray-500">
          <textarea
            rows={3}
            className="flex-1 p-2 bg-heroBlue text-white outline-none rounded-lg shadow-[3px_3px_0px_black] resize-none"
            placeholder="Share a memory, a moment of appreciation or a simple goodbye..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />

          {/* Username Input & Send Button */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-heroRed text-white font-bold rounded-full shadow-lg hover:bg-heroYellow hover:text-black transition"
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Send"}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-center font-bold">{error}</p>
          )}
        </div>
      </CardContent>
    </div>
  );
}
