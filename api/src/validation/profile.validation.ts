import { z } from "zod";

const whatsAppRegex = /^\+[1-9]\d{9,14}$/;

const ProfileSchema = z.object({
  fullName: z.string(),
  email: z.string().email(),
  whatsAppNumber: z
    .string()
    .regex(whatsAppRegex, {
      message: "Number should begin with a +, have country code and the correct number of digits",
    })
    .optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export { ProfileSchema };
