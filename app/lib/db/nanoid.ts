import { customAlphabet } from "nanoid";

export const NANOID_LENGTH = 21;
export const NANOID_SHORT_LENGTH = 12;

export const nanoidLowercase = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyz",
  NANOID_SHORT_LENGTH,
);
