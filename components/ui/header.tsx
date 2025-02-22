import Image from "next/image";
import Logo from "@/public/menu-logo.png";

export default function HeroHeader() {
  return (
    <header className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 py-4 md:py-6 px-4">
      {/* BP Pulse Logo */}
      <Image
        src={Logo}
        alt="BP Pulse Logo"
        width={200}
        height={60}
        className="w-[150px] md:w-[250px] h-auto"
      />

      {/* Title */}
      <h1 className="text-3xl md:text-6xl font-hero text-heroYellow drop-shadow-lg text-center">
        Superheroes
      </h1>
    </header>
  );
}
