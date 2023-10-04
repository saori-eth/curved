import { PUBLIC_ID_LENGTH } from "db";
import { customAlphabet } from "nanoid";

export const nanoidLowercase = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  PUBLIC_ID_LENGTH,
);
