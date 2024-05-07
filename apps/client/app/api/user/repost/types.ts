import { MAX_CAPTION_LENGTH, PUBLIC_ID_LENGTH } from "db";
import { z } from "zod";

export const RepostArgs = z.object({
  caption: z.string().max(MAX_CAPTION_LENGTH).optional(),
  postId: z.string().length(PUBLIC_ID_LENGTH),
});

export type RepostArgs = z.infer<typeof RepostArgs>;

export type RepostResponse = {
  postId: string;
};
