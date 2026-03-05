import { Twinkle } from "@/components/twinkle/twinkle";

export default function TravelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Twinkle>
      {children}
    </Twinkle>
  );
}
