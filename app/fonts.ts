import {
  Lexend as LexendFont,
  Libre_Baskerville as BaskervilleFont,
} from "next/font/google";

const lexend = LexendFont({
  display: "swap",
  subsets: ["latin"],
});

const baskerville = BaskervilleFont({
  display: "swap",
  weight: ["400"],
  subsets: ["latin"],
});

export { lexend, baskerville };
