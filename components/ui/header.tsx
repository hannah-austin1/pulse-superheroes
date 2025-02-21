import Image from "next/image";
import Logo from "@/public/menu-logo.png";

export default function HeroHeader() {
  return (
    <header className="bg-heroRed flex items-center justify-center space-x-4 py-6 border-heroYellow border-b-4">
      {/* BP Pulse Logo */}
      <Image src={Logo} alt="BP Pulse Logo" width={250} height={80} />

      {/* Title */}
      <h1 className="text-6xl font-hero text-heroYellow drop-shadow-lg">
        Superheroes
      </h1>
    </header>
  );
}
