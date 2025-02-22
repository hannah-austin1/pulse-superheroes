"use client";

import { useEffect, useState, useRef, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { addComment } from "@/app/actions"; // ✅ Connects to DB
import { User, Comment } from "@/types";

interface CommentsSectionProps {
  user: User;
}

export default function CommentsSection({ user }: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(user.comments || []);
  const [newMessage, setNewMessage] = useState("");
  const [usernameInput, setUsernameInput] = useState(""); // ✅ This is only for input
  const [username, setUsername] = useState<string | null>(null); // ✅ This is for sending
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // ✅ Fetch latest comments from DB when the component mounts
  useEffect(() => {
    setComments(user.comments || []);
  }, [user.comments]);

  // ✅ Scroll to the bottom when comments update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments.length]); // ✅ Only scroll when a new message is added

  // ✅ Handle sending a new message and storing it in DB
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !usernameInput.trim()) return;

    // ✅ Set the username for message sending
    if (!username) {
      setUsername(usernameInput);
    }

    startTransition(async () => {
      const result = await addComment(user.id, usernameInput, newMessage);
      if (result.error) {
        setError(result.error);
      } else {
        setError(null);

        // ✅ Add new comment **to the END of the array**
        setComments((prev) => [
          ...prev, // Keep old messages
          {
            id: String(Date.now()),
            name: usernameInput,
            content: newMessage,
          } as Comment,
        ]);

        setNewMessage("");

        // ✅ Scroll down after adding the message
        setTimeout(
          () => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }),
          100
        );
      }
    });
  };

  return (
    <div className="flex flex-col w-full h-full text-white">
      {/* Title */}
      <h3 className="text-xl font-bold text-heroYellow mb-2 text-center">
        Messages
      </h3>

      {/* ✅ Chat Messages */}
      <div className="flex-grow overflow-y-auto flex flex-col gap-2 p-2">
        <AnimatePresence initial={false}>
          {comments.length > 0 ? (
            comments.map((comment) => {
              const isMe = comment.name === username; // ✅ Only checks AFTER sending

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
                  className={`max-w-[75%] p-3 rounded-lg border-2 border-heroYellow shadow-heroInset ${
                    isMe ? "bg-heroBlue self-end" : "bg-heroDark self-start"
                  }`}
                >
                  <strong className="text-heroYellow">{comment.name}:</strong>{" "}
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
      <div className="mt-4 flex flex-col border-t-2 border-heroYellow pt-2 gap-2">
        {/* Username Input (Only Used Once) */}
        {!username && (
          <input
            type="text"
            className="p-2 bg-heroDark text-white rounded-lg border-2 border-heroYellow outline-none"
            placeholder="Enter your name..."
            value={usernameInput}
            onChange={(e) => setUsernameInput(e.target.value)}
          />
        )}

        {/* Message Input & Send Button */}
        <div className="flex items-center gap-2">
          <input
            type="text"
            className="flex-1 p-2 bg-heroDark text-white rounded-lg border-2 border-heroYellow outline-none"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()} // Send on Enter
          />
          <button
            onClick={handleSendMessage}
            className="px-4 py-2 bg-heroYellow text-black font-bold rounded-lg shadow-lg hover:bg-yellow-400 transition"
            disabled={isPending}
          >
            {isPending ? "Saving..." : "Send"}
          </button>
        </div>

        {error && <p className="text-red-500 text-center font-bold">{error}</p>}
      </div>
    </div>
  );
}
