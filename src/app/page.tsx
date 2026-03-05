import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <Link href={"/courses"}>
      go to course
      </Link>
    </div>
  );
}
