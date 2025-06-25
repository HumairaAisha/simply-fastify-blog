import Fastify from "fastify";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import cookie from "@fastify/cookie";
import cors from "@fastify/cors";
import authRoutes from "./auth/auth.route.js";
import postRoutes from "./post/post.routes.js";
import { createSuperAdmin } from "./auth/auth.controller.js";

const app = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

app.register(cors, {
  origin: (_origin, cb) => {
    cb(null, true);
  },
  methods: ["GET", "HEAD", "PUT", "PATCH", "POST", "DELETE"],
  credentials: true,
});

app.register(cookie, {
  secret: process.env.COOKIE_SECRET,
  parseOptions: {},
});

app.register(authRoutes);
app.register(postRoutes, { prefix: "/posts" });

// Run the server!
const start = async () => {
  try {
    if (!process.env.SUPER_ADMIN_PASSWORD)
      throw new Error("SUPER_ADMIN_PASSWORD not defined in .env file");

    await app.listen({ port: 3000 });
    await createSuperAdmin({
      email: "admin@email.com",
      name: "super admin",
      password: process.env.SUPER_ADMIN_PASSWORD || "password",
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};
start();
