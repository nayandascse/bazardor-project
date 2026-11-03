import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "@/lib/schema";

const client = createClient({ url: process.env.DATABASE_URL || "file:./local.db" });
const db = drizzle(client, { schema });

export const auth = betterAuth({
  database: drizzleAdapter(db, { provider: "sqlite", schema }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID || "",
      clientSecret: process.env.GITHUB_CLIENT_SECRET || ""
    }
  },
  plugins: [nextCookies()],
});
