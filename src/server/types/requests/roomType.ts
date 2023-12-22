import { z } from "zod";

export const createRoomTypeSchema = z.object({
  roomName: z.string().min(3),
  password: z.string().min(3).max(10).optional()
});

type CreateRoomType = z.infer<typeof createRoomTypeSchema>;
export default CreateRoomType;

export const boardClickTypeSchema = z.object({
  x: z.number(),
  y: z.number()
});