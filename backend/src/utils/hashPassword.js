import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export async function hashPassword(password) {
    return await bcrypt.hash(password, SALT_ROUNDS);
};