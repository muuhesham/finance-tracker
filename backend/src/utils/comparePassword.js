import bcrypt from "bcryptjs";

export async function comparePassword(password, hashPassword) {
    return await bcrypt.compare(password, hashPassword);
}