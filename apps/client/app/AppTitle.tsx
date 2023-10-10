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
  const color1 = randomColor(0);

  let color2: string | undefined;
  let color3: string | undefined;

  // Pick unique colors
  let i = 0;
  while (!color2 || !color3) {
    i++;

    const color = randomColor(i);
    if (color === color1 || color === color2 || color === color3) continue;

    if (!color2) {
      color2 = color;
      continue;
    }

    if (!color3) {
      color3 = color;
      continue;
    }
  }

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
