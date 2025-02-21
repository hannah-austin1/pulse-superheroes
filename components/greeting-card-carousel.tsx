import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Image from "next/image";
import { User } from "@/types";
import CommentForm from "@/components/ui/comment-form";
import DownloadButton from "@/components/ui/download-button";

interface GreetingCardCarouselProps {
  users: User[];
}

export default function GreetingCardCarousel({
  users,
}: GreetingCardCarouselProps) {
  const url = process.env.NEXT_PUBLIC_IMAGE_ENDPOINT;

  return (
    <div className="w-full max-w-5xl mx-auto p-6 flex flex-col items-center h-full">
      {users.length === 0 ? (
        <p className="text-center text-gray-400 text-xl">No heroes found.</p>
      ) : (
        <Carousel opts={{ loop: true }} className="w-full">
          <CarouselContent className="flex w-full">
            {users.map((user) => {
              const imgSrc = `${url}/${user.name.split(" ")[0]}.png`;

              return (
                <CarouselItem
                  key={user.id}
                  className="w-full flex justify-center items-center"
                >
                  {/* Superhero Card (Scrollable) */}
                  {/* Superhero Card (Full Height & Scrollable) */}
                  <div className="relative transition-all duration-300 transform hover:scale-95 hover:border-4 hover:border-heroYellow hover:shadow-heroGlow rounded-xl w-full md:w-[800px] overflow-hidden h-screen md:h-[600px]">
                    <Card className="hero-card w-full h-full overflow-hidden">
                      {/* Scrollable Content with Smooth Scrolling */}
                      <CardContent className="flex flex-col items-center justify-start h-full w-full overflow-y-auto scroll-smooth p-0 md:p-3">
                        {/* User Name & Buttons Section */}
                        <div className="flex flex-col md:flex-row items-center w-full justify-between h-auto md:h-20 flex-shrink-0 mb-3">
                          {/* Prevent name from wrapping */}
                          <p className="text-3xl md:text-5xl font-hero text-heroYellow drop-shadow-md text-center md:text-left">
                            {user.name}
                          </p>

                          {/* Download Buttons - Stays Above Image on Mobile */}
                          <div className="flex justify-center md:justify-end flex-wrap gap-2 order-1 md:order-none">
                            <DownloadButton user={user} type="pdf" />
                            <DownloadButton user={user} type="icon" />
                          </div>
                        </div>

                        {/* Hero Image & Stats Section (Stacked on Mobile) */}
                        <CardContent className="flex flex-col md:flex-row p-0 gap-5 w-full h-auto md:h-[300px]">
                          {/* Left Side: Hero Image */}
                          <div className="w-full md:w-5/12 h-auto md:h-full">
                            <Image
                              src={imgSrc}
                              alt={`Hero ${user.name}`}
                              width={300}
                              height={300}
                              className="w-full h-auto md:h-full object-cover rounded-lg border-4 border-heroRed shadow-heroGlow"
                            />
                          </div>

                          {/* Right Side: Hero Stats */}
                          <div className="w-full md:w-7/12 h-auto md:h-full flex flex-col justify-center text-white space-y-4 text-lg rounded-lg border-4 border-heroRed shadow-heroGlow p-3 pt-6">
                            <p>
                              <strong className="text-heroYellow">Team:</strong>{" "}
                              {user.team || "Unknown"}
                            </p>
                            <p>
                              <strong className="text-heroYellow">
                                Time on Project:
                              </strong>{" "}
                              {user.time_on_project || "N/A"}
                            </p>
                            <p>
                              <strong className="text-heroYellow">
                                Tickets Worked on:
                              </strong>{" "}
                              {user.tickets_completed || "N/A"}
                            </p>
                            <p>
                              <strong className="text-heroYellow">
                                Favorite Moment:
                              </strong>{" "}
                              {user.favourite_moment || "None yet"}
                            </p>
                          </div>
                        </CardContent>

                        {/* Comments Section */}
                        <div className="w-full text-center flex flex-col flex-grow">
                          {/* Add comment form inside the carousel */}
                          <div className="mt-4 w-full mb-4">
                            <CommentForm userId={user.id} />
                          </div>

                          <h3 className="text-xl font-bold text-heroYellow mb-2">
                            Comments
                          </h3>

                          <div className="mt-4 mb-4 space-y-3 text-sm p-4 border-4 border-heroRed bg-black text-white rounded-lg shadow-heroGlow">
                            {user.comments && user.comments.length > 0 ? (
                              user.comments.map((comment) => (
                                <div
                                  key={comment.id}
                                  className="p-4 bg-heroDark text-white rounded-lg border-2 border-heroYellow shadow-heroInset"
                                >
                                  <strong className="text-heroYellow">
                                    {comment.name}:
                                  </strong>{" "}
                                  {comment.content}
                                </div>
                              ))
                            ) : (
                              <p className="text-gray-400 text-center font-bold">
                                No heroic messages yet. Be the first!
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>

          {/* Navigation Buttons */}
          <CarouselPrevious className="hero-btn" />
          <CarouselNext className="hero-btn" />
        </Carousel>
      )}
    </div>
  );
}
