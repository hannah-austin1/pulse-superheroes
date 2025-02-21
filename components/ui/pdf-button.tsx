"use client";

import React, { useState } from "react";
import { pdf } from "@react-pdf/renderer";
import UserCardPDF from "./user-card-pdf";
import { Button } from "./button";
import { User } from "@/types";

interface PDFDownloadButtonProps {
  user: User;
}

export default function PDFDownloadButton({ user }: PDFDownloadButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownload = async () => {
    setIsGenerating(true);

    try {
      const doc = <UserCardPDF user={user} />;
      const blob = await pdf(doc).toBlob();
      const url = URL.createObjectURL(blob);

      // Create a temporary link element to download the file
      const link = document.createElement("a");
      link.href = url;
      link.download = `${user.name}_Superhero_Card.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      onClick={handleDownload}
      className="px-6 py-3 bg-heroRed text-white font-bold rounded-lg shadow-lg transition hover:bg-heroYellow"
      disabled={isGenerating}
    >
      {isGenerating ? "Generating PDF..." : "Download PDF"}
    </Button>
  );
}
