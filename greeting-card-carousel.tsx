"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import Image from "next/image"

type Comment = {
  text: string
  timestamp: number
}

type UserComments = {
  [username: string]: Comment[]
}

type GreetingCard = {
  id: number
  message: string
  image: string
  color: string
  comments: UserComments
}

const initialGreetingCards: GreetingCard[] = [
  {
    id: 1,
    message: "Happy Birthday!",
    image: "/placeholder.svg?height=300&width=200",
    color: "bg-pink-100",
    comments: {},
  },
  {
    id: 2,
    message: "Congratulations!",
    image: "/placeholder.svg?height=300&width=200",
    color: "bg-blue-100",
    comments: {},
  },
  { id: 3, message: "Thank You!", image: "/placeholder.svg?height=300&width=200", color: "bg-green-100", comments: {} },
  {
    id: 4,
    message: "Get Well Soon!",
    image: "/placeholder.svg?height=300&width=200",
    color: "bg-purple-100",
    comments: {},
  },
  {
    id: 5,
    message: "Happy Holidays!",
    image: "/placeholder.svg?height=300&width=200",
    color: "bg-red-100",
    comments: {},
  },
]

export default function GreetingCardCarousel() {
  const [greetingCards, setGreetingCards] = useState<GreetingCard[]>(initialGreetingCards)

  const handleCommentSubmit = (cardId: number, name: string, comment: string) => {
    setGreetingCards((prevCards) =>
      prevCards.map((card) =>
        card.id === cardId
          ? {
              ...card,
              comments: {
                ...card.comments,
                [name]: [...(card.comments[name] || []), { text: comment, timestamp: Date.now() }],
              },
            }
          : card,
      ),
    )
  }

  const allComments = greetingCards.flatMap((card) =>
    Object.entries(card.comments).flatMap(([username, comments]) =>
      comments.map((comment) => ({ ...comment, username, cardMessage: card.message })),
    ),
  )

  return (
    <div className="w-full max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-center mb-6">Greeting Card Carousel</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <Carousel
            opts={{
              loop: true,
            }}
          >
            <CarouselContent>
              {greetingCards.map((card) => (
                <CarouselItem key={card.id} className="md:basis-1/2 lg:basis-1">
                  <div className="p-1">
                    <Card className={`${card.color} overflow-hidden`}>
                      <CardContent className="flex flex-col items-center justify-between p-6 h-[600px]">
                        <div className="flex flex-col items-center mb-4">
                          <Image
                            src={card.image || "/placeholder.svg"}
                            alt={`Greeting card ${card.id}`}
                            width={200}
                            height={300}
                            className="rounded-lg mb-4 object-cover"
                          />
                          <p className="text-xl font-semibold text-center">{card.message}</p>
                        </div>
                        <div className="w-full">
                          <h3 className="text-lg font-semibold mb-2">Comments</h3>
                          <ScrollArea className="h-48 mb-4 border rounded-md p-2">
                            {Object.entries(card.comments).map(([username, comments]) => (
                              <div key={username} className="mb-3">
                                <h4 className="font-semibold text-sm">{username}</h4>
                                {comments.map((comment, index) => (
                                  <p key={index} className="text-sm ml-2 mb-1">
                                    {comment.text}
                                  </p>
                                ))}
                              </div>
                            ))}
                          </ScrollArea>
                          <CommentForm onSubmit={(name, comment) => handleCommentSubmit(card.id, name, comment)} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
        <div>
          <Card>
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">All Comments</h3>
              <ScrollArea className="h-[600px] pr-4">
                {allComments.map((comment, index) => (
                  <div key={index} className="mb-4 p-3 bg-gray-100 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Card: {comment.cardMessage}</p>
                    <p className="text-sm mb-1">
                      <strong>{comment.username}:</strong> {comment.text}
                    </p>
                  </div>
                ))}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function CommentForm({ onSubmit }: { onSubmit: (name: string, comment: string) => void }) {
  const [name, setName] = useState("")
  const [comment, setComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim() && comment.trim()) {
      onSubmit(name.trim(), comment.trim())
      setComment("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <Input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} required />
      <Textarea placeholder="Add a comment..." value={comment} onChange={(e) => setComment(e.target.value)} required />
      <Button type="submit" className="w-full">
        Add Comment
      </Button>
    </form>
  )
}

