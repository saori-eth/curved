import { z } from "zod";

import {
  FILE_KEY_LENGTH,
  MAX_USERNAME_LENGTH,
  MIN_USERNAME_LENGTH,
} from "@/lib/db/constants";

export const UpdateUserSchema = z.object({
  avatar: z.string().length(FILE_KEY_LENGTH).optional(),
  username: z
    .string()
    .min(MIN_USERNAME_LENGTH)
    .max(MAX_USERNAME_LENGTH)
    .optional(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserSchema>;
