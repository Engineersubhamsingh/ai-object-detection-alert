import ObjectDetection from "@/components/object-detection";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-white via-gray-300 to-gray-600">
      <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 font-extrabold text-3xl md:text-6xl lg:text-8xl tracking-tighter md:px-6 text-center">
        Thief Detection Alarm
      </h1>
      <ObjectDetection/>
    </main>
  );
}
