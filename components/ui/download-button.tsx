"use client";

import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import UserCardPDF from "./user-card-pdf";
import { User } from "@/types";
import { Download } from "lucide-react"; // Import the download icon

interface DownloadButtonProps {
  user: User;
  type: "pdf" | "icon"; // Type of download
}

export default function DownloadButton({ user, type }: DownloadButtonProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDownload = async () => {
    setIsLoading(true);

    try {
      if (type === "pdf") {
        let url = "";
        try {
          const blob = await pdf(<UserCardPDF user={user} />).toBlob();
          url = URL.createObjectURL(blob);

          const response = await fetch(url);
          const blobData = await response.blob();
          const blobUrl = window.URL.createObjectURL(blobData);

          const link = document.createElement("a");
          link.href = blobUrl;
          link.download = `${user.name}_Superhero_Card.pdf`;
          link.click();
        } catch (error) {
          console.error("Error in download process:", error);
        } finally {
          if (url) URL.revokeObjectURL(url);
        }
      } else if (type === "icon") {
        // Icon Download
        const imgSrc =
          process.env.NEXT_PUBLIC_IMAGE_ENDPOINT +
          `/${user.name.split(" ")[0]}.png`;
        const response = await fetch(imgSrc);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${user.name}_icon.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isLoading}
      className={`flex items-center gap-2 px-6 py-3 font-bold rounded-full shadow-xl transition text-sm ${
        type === "pdf"
          ? "bg-heroRed text-white hover:bg-heroYellow"
          : "bg-heroYellow text-black hover:bg-heroRed"
      }`}
    >
      <Download className="w-5 h-5" /> {/* SVG Icon */}
      {isLoading
        ? "Processing..."
        : type === "pdf"
        ? "Download PDF"
        : "Download Icon"}
    </button>
  );
}
