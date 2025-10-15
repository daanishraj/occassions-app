import { z } from "zod";

const phoneRegex = /^\+[1-9]\d{9,14}$/;

const ProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").max(50),
  lastName: z.string().min(1, "Last name is required").max(50),
  email: z.string().email(),
  phoneNumber: z
    .string()
    .regex(phoneRegex, {
      message: "Number should begin with a +, have country code and the correct number of digits",
    })
    .optional(),
});

export type Profile = z.infer<typeof ProfileSchema>;

export { ProfileSchema };
