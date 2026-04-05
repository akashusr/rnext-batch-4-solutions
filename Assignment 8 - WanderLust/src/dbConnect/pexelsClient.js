import { createClient } from "pexels";

export const pexelsClient = createClient(process.env.PEXELS_API_KEY || "");
