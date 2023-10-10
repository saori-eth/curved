import { Quicksand } from "next/font/google";
import Link from "next/link";

const font = Quicksand({
  display: "swap",
  subsets: ["latin"],
});

const colors = [
  "#ff516a",
  "#ffe5cc",
  "#5ff7f6",
  "#a294fd",
  "#fea23e",
  "#19b4d0",
  "#fa3567",
];

/**
 * Deterministically generate a random color based on the current time.
 */
function randomColor(index = 0) {
  const hour = Math.floor(Date.now() / 1000 / 60 / 60);
  const color = colors[(hour + index) % colors.length];
  return color;
}

export function AppTitle() {
  const color1 = randomColor(1);
  const color2 = randomColor(2);
  const color3 = randomColor(3);

  return (
    <Link href="/" className="w-fit">
      <h1 className={`text-xl font-bold md:text-2xl ${font.className}`}>
        <span
          style={{
            color: color1,
          }}
        >
          yuyu
        </span>
        <span
          style={{
            color: color2,
          }}
        >
          .
        </span>
        <span
          style={{
            color: color3,
          }}
        >
          social
        </span>
      </h1>
    </Link>
  );
}
