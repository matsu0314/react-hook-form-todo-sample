import Image from "next/image";
import { ImprovedTodoList } from "@/components/elements/ImprovedTodoList";

export default function Home() {
  return (
    <main>
      <h2>todoサンプル（react-hook-form）</h2>
      <ImprovedTodoList />
    </main>
  );
}
