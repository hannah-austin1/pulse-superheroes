/* eslint-disable jsx-a11y/alt-text */
"use client";

import React, { JSX } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
  Font,
} from "@react-pdf/renderer";
import { User } from "@/types";

import emojiRegex from "emoji-regex";
import Bangers from "@/public/fonts/Bangers-Regular.ttf";
import Poppins from "@/public/fonts/Poppins-Regular.ttf";
import PoppinsBold from "@/public/fonts/Poppins-Bold.ttf";

// ✅ Function to Convert Emojis to Image URLs (Cloudflare CDN)
const replaceEmojisWithImages = (text: string) => {
  const regex = emojiRegex();
  let lastIndex = 0;
  const parts: (string | JSX.Element)[] = [];

  for (const match of text.matchAll(regex)) {
    const emoji = match[0];
    const emojiIndex = match.index ?? 0;

    // ✅ Add text before the emoji
    if (lastIndex < emojiIndex) {
      parts.push(text.substring(lastIndex, emojiIndex));
    }

    // ✅ Convert emoji to Cloudflare Twemoji URL (Uses correct Unicode conversion)
    const emojiCodePoints = Array.from(emoji)
      .map((char) => char.codePointAt(0)?.toString(16))
      .join("-");

    const emojiUrl = `https://cdnjs.cloudflare.com/ajax/libs/twemoji/14.0.2/72x72/${emojiCodePoints}.png`;

    parts.push(
      <Image
        key={emojiIndex}
        src={emojiUrl}
        style={{ width: 14, height: 14 }}
      />
    );

    lastIndex = emojiIndex + emoji.length;
  }

  // ✅ Add remaining text after last emoji
  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts;
};

// 📥 Register Fonts
Font.register({
  family: "Bangers",
  src: Bangers,
});

Font.register({
  family: "Poppins",
  fonts: [
    {
      src: Poppins,
    },
    {
      src: PoppinsBold,
      fontWeight: "bold",
    },
  ],
});

// 🎨 Tailwind-Inspired Styles with Superhero Theme
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#1D3557", // Heroic blue
    color: "#FFFFFF",
    fontFamily: "Poppins",
  },
  top: {
    borderRadius: 8,
    borderWidth: 4,
    borderColor: "#FFD700",
    zIndex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E63946",
    paddingBottom: 10,
    paddingTop: 16,
  },
  logo: {
    width: 150, // Adjust based on PDF scaling
    height: 40,
    marginRight: 12,
  },
  title: {
    fontSize: 36,
    fontFamily: "Bangers",
    color: "#FFD700", // Gold text
  },
  body: {
    paddingTop: 10,
  },
  heroSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    backgroundColor: "#222222",
  },
  image: {
    width: 150, // Square Image
    height: 150,
    borderRadius: 8,
    borderColor: "#E63946",
    borderWidth: 4,
  },
  statsContainer: {
    flex: 1,
    marginLeft: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: "Poppins",
    fontWeight: "bold",
    color: "#FFD700", // Gold for headings
  },
  value: {
    fontSize: 14,
    fontFamily: "Poppins",
    color: "#FFFFFF",
  },
  commentsContainer: {
    padding: 10,
    backgroundColor: "#1D1D1D",
    borderRadius: 8,
    borderWidth: 4,
    borderColor: "#E63946", // Red border like hero glow
  },
  name: {
    fontWeight: 800,
  },
  comment: {
    fontSize: 12,
    fontFamily: "Poppins",
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#FFD700",
    marginBottom: 4,
  },
});

const UserCardPDF: React.FC<{ user: User }> = ({ user }) => {
  const imgSrc =
    process.env.NEXT_PUBLIC_IMAGE_ENDPOINT + `/${user.name.split(" ")[0]}.png`;

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.top}>
          {/* Header with Logo & Title */}
          <View style={styles.header}>
            <Image
              src="https://bfcujebvtxcnkjyhrgjf.supabase.co/storage/v1/object/public/cartoons//menu-logo.png"
              style={styles.logo}
            />
            <Text style={styles.title}>Superheroes</Text>
          </View>

          {/* Hero Section: Image & Stats Side by Side */}
          <View style={styles.heroSection}>
            {/* Square Profile Image */}
            <Image src={imgSrc} style={styles.image} />

            {/* Hero Stats */}
            <View style={styles.statsContainer}>
              <Text style={styles.title}>{user.name}</Text>
              <Text style={styles.label}>
                Team: <Text style={styles.value}>{user.team || "Unknown"}</Text>
              </Text>
              <Text style={styles.label}>
                Days on Project:{" "}
                <Text style={styles.value}>
                  {user.time_on_project || "N/A"}
                </Text>
              </Text>
              <Text style={styles.label}>
                Tickets Completed:{" "}
                <Text style={styles.value}>{user.tickets_completed || 0}</Text>
              </Text>
              <Text style={styles.label}>
                Favorite Moment:{" "}
                <Text style={styles.value}>
                  {user.favourite_moment || "None yet"}
                </Text>
              </Text>
            </View>
          </View>
        </View>

        {/* Comments Section */}
        <View style={styles.body}>
          <View style={styles.commentsContainer}>
            <Text style={styles.label}>Comments:</Text>
            {user.comments && user.comments.length > 0 ? (
              user.comments.map((comment, index) => (
                <Text
                  key={index}
                  style={[
                    styles.comment,
                    index === (user?.comments?.length ?? 0) - 1
                      ? { borderBottomWidth: 0 }
                      : {}, // Remove border for last comment
                  ]}
                >
                  <Text style={styles.name}>{comment.name}</Text>:{" "}
                  {replaceEmojisWithImages(comment.content)}
                </Text>
              ))
            ) : (
              <Text style={styles.value}>No heroic messages yet.</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default UserCardPDF;
