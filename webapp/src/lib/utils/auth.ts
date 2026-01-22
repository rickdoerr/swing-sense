import { betterAuth } from "better-auth";
import { Database } from "bun:sqlite";

export const auth = betterAuth({
    database: new Database("./sqlite.db"),
    emailAndPassword: {
        enabled: true,
        async sendResetPassword(url, user) {
            console.log("Reset password url:", url);
        }
    },
    emailVerification: {
        sendOnSignUp: false,
    },
})
