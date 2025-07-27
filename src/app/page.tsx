import Image from "next/image";


export default function Home() {
  return (
    <div className="grid grid-rows-1 items-start md:items-center justify-items-center min-h-screen p-2 pb-20 gap-16 sm:p-10 md:p-20 animate-gradient gradient-bg">
      <main className="flex flex-col gap-[32px] sm:items-start items-center max-w-[850px] mt-2 sm:mt-4 md:mt-0">
        <Image
          className="rounded-lg shadow-2xl/100"
          src="/loading-page.jpeg"
          alt="Happy couple holding hands"
          width={2560}
          height={1440}
          quality={50}
          priority
        />
      </main>
    </div>
  );
}
