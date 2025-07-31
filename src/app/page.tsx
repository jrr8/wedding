import { Confetti } from "@/components/confetti/confetti";
import Image from "next/image";
import RSVPModalButton from "@/components/RSVPModal/RSVPModalButton";
import ScrollGradient from "@/components/scroll-gradient";

export default function Home() {
  return (
    <div className="grid grid-rows-1 items-start md:items-center justify-items-center min-h-full p-2 pb-20 gap-16 sm:p-10 md:p-20">
      <ScrollGradient />
      <main className="flex flex-col gap-[32px] items-center max-w-[850px] mt-2 sm:mt-4 md:mt-0 z-0">
        <Confetti n={20} />
        <Image
          className="rounded-lg shadow-2xl/100"
          src="/loading-page.jpg"
          alt="Happy couple holding hands"
          width={2560}
          height={1440}
          quality={50}
          priority
        />
        <div className="text-center flex flex-col gap-4">
          <h2 className="text-4xl font-swash font-bold">
            We&apos;re getting married!
          </h2>
          <p className="text-2xl flex items-center justify-center gap-3">
            <Image
              src="/pink-disco.gif"
              alt="sparkle"
              width={263}
              height={247}
              className="w-8 h-8"
            />
            <strong>May 30, 2026</strong>
            <Image
              src="/pink-disco.gif"
              alt="sparkle"
              width={263}
              height={247}
              className="w-8 h-8"
            />
          </p>
          <RSVPModalButton />
        </div>
      </main>
      {/* Wedding Weekend Section */}
      <section className="flex flex-col gap-6 items-center text-center max-w-[850px] mx-2 sm:mx-0">
        <h3 className="text-2xl font-swash font-bold">
          The Wedding Weekend
        </h3>

        <p className="text-lg max-w-prose bg-white/80 p-4 rounded-lg shadow">
          <strong className="text-xl font-swash font-bold">
            Welcome Party
          </strong>
          <br />
          May 29, 2026 <br></br>
          5-8pm <br></br>
          Near the venue (exact location TBD)
          <br></br>
          <br></br>
          <strong className="text-xl font-swash font-bold">
            Ceremony
          </strong>
          <br />
          May 30, 2026 <br></br>
          Afternoon (exact time TBD) <br></br>
          Kismet House<br></br>
          1467 US-44 Clintondale, NY 12515<br></br>
          <br></br>
          The ceremony will be at the pond, about 5-10 minutes from the parking
          lot. Comfortable footwear is advised!
          <br></br>
          <br></br>
          <strong className="text-xl font-swash font-bold">
            Reception & After Party
          </strong>
          <br />
          After the ceremony, we&apos;ll have cocktails, dinner and dancing
          until 10pm. For those who want to keep the party going, the Kismet
          barn is sound proofed! Karaoke?
        </p>

        <Image
          src="/wedding-weekend.jpg"
          alt="Venue Map"
          width={692}
          height={722}
          quality={50}
          priority
          className="rounded-lg shadow-lg w-[600]"
        />
      </section>
    </div>
  );
}
