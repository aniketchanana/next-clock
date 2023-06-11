import Clock from "@/components/Clock";
import ClockSvg from "@/components/ClockSvg";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex items-center justify-center h-full w-full">
      {/* <Clock /> */}
      <ClockSvg />
    </div>
  );
}
