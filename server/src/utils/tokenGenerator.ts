import { Visitor } from "../models";

export const generateToken = async (): Promise<string> => {
  let token: string;
  let isUnique = false;

  while (!isUnique) {
    // Generate a random token (format: TKN-XXXXXX)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let random = "";
    for (let i = 0; i < 6; i++) {
      random += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    token = `TKN-${random}`;

    // Check if token already exists
    const existing = await Visitor.findOne({
      where: { check_in_token: token },
    });

    if (!existing) {
      isUnique = true;
      return token;
    }
  }

  return "TKN-" + Date.now().toString(36).toUpperCase();
};