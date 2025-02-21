/* eslint-disable jsx-a11y/alt-text */
"use client";

import React from "react";
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

// 📥 Register Fonts
Font.register({
  family: "Bangers",
  src: "https://raw.githubusercontent.com/google/fonts/main/ofl/bangers/Bangers-Regular.ttf",
});

Font.register({
  family: "Poppins",
  fonts: [
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Regular.ttf",
    },
    {
      src: "https://raw.githubusercontent.com/google/fonts/main/ofl/poppins/Poppins-Bold.ttf",
      fontWeight: "bold",
    },
  ],
});

Font.register({
  family: "Noto Color Emoji",
  src: "https://github.com/googlefonts/noto-emoji/blob/main/fonts/NotoColorEmoji-Regular.ttf?raw=true",
});

// 🎨 Tailwind-Inspired Styles with Superhero Theme
const styles = StyleSheet.create({
  page: {
    backgroundColor: "#1D3557", // Heroic blue
    color: "#FFFFFF",
    fontFamily: "Poppins",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderBottomWidth: 4,
    backgroundColor: "#E63946",
    borderBottomColor: "#FFD700",
    paddingBottom: 10,
    marginBottom: 16,
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
    padding: 24,
  },
  heroSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#222222",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "#FFD700",
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
    marginTop: 12,
    padding: 10,
    backgroundColor: "#1D1D1D",
    borderRadius: 8,
    borderWidth: 2,
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
        {/* Header with Logo & Title */}
        <View style={styles.header}>
          <Image
            src="https://bfcujebvtxcnkjyhrgjf.supabase.co/storage/v1/object/public/cartoons//menu-logo.png"
            style={styles.logo}
          />
          <Text style={styles.title}>Superheroes</Text>
        </View>

        <View style={styles.body}>
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

          {/* Comments Section */}
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
                  {comment.content}
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
