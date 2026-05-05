import { Twinkle } from "@/components/twinkle/twinkle";

export default function ToDoLayout({
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
