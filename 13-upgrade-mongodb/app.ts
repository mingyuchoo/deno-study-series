import { Application } from "https://deno.land/x/oak/mod.ts";

import dogsRouter from "./controllers/dogs.ts";
import friendsRouter from "./controllers/friends.ts";

const env = Deno.env.toObject();
const PORT = env.PORT || 4000;
const HOST = env.HOST || "127.0.0.1";

const app = new Application();

app.addEventListener("listen", ({ hostname, port, secure }) => {
  console.log(
    `Listening on: ${secure ? "https://" : "http://"}${hostname ??
      "localhost"}:${port}`,
  );
});

// Logger
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.headers.get("X-Response-Time");
  console.log(`${ctx.request.method} ${ctx.request.url} - ${rt}`);
});

// Timing
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.response.headers.set("X-Response-Time", `${ms}ms`);
});

// friends
app.use(friendsRouter.routes());
app.use(friendsRouter.allowedMethods());

// dogs
app.use(dogsRouter.routes());
app.use(dogsRouter.allowedMethods());

// Listen
console.log(`Listening on port ${PORT}...`);
await app.listen(`${HOST}:${PORT}`);
