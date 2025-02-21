"use client";
import { useState, useTransition } from "react";
import { addComment } from "@/app/actions";
import { Input } from "./input";
import { Textarea } from "./textarea";
import { Button } from "./button";

interface CommentFormProps {
  userId: string;
}

export default function CommentForm({ userId }: CommentFormProps) {
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  if (!userId)
    return (
      <p className="text-center text-heroYellow">
        Select a hero to add a comment.
      </p>
    );

  const submitComment = () => {
    startTransition(async () => {
      const result = await addComment(userId, name, comment);
      if (result.error) {
        setError(result.error);
      } else {
        setName("");
        setComment("");
        setError(null);
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-heroDark border-4 border-heroRed shadow-heroGlow rounded-lg">
      <h3 className="text-2xl font-hero text-heroYellow text-center">
        Leave a Message!
      </h3>

      <Input
        type="text"
        className="p-3 border-2 border-heroYellow bg-black text-white rounded-lg focus:ring-heroYellow focus:ring-2"
        placeholder="Your Hero Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <Textarea
        className="p-3 border-2 border-heroYellow bg-black text-white rounded-lg focus:ring-heroYellow focus:ring-2"
        placeholder="Share a memory, a moment of appreciation or a simple goodbye!"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />

      {error && <p className="text-red-500 text-center font-bold">{error}</p>}

      <Button
        className="px-5 py-3 bg-heroRed text-white font-bold uppercase tracking-wide rounded-lg shadow-lg 
          transition-transform duration-200 transform hover:scale-105 hover:shadow-heroGlow"
        onClick={submitComment}
        disabled={isPending}
      >
        {isPending ? "Powering Up..." : "Send Message"}
      </Button>
    </div>
  );
}
