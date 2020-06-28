import { Application, Router } from "https://deno.land/x/oak/mod.ts";

const env = Deno.env.toObject();
const PORT = env.PORT || 4000;
const HOST = env.HOST || "127.0.0.1";

const data = JSON.parse(Deno.readTextFileSync("./dogs.json"));

interface Dog {
  name: string;
  age: number;
}

let dogs: Array<Dog> = data;

export const getDogs = ({ response }: { response: any }) => {
  response.body = dogs;
};

export const getDog = ({
  params,
  response,
}: {
  params: {
    name: string;
  };
  response: any;
}) => {
  const dog = dogs.filter((dog) => dog.name === params.name);
  if (dog.length) {
    response.status = 200;
    response.body = dog[0];
    return;
  }
  response.status = 404;
  response.body = { msg: `Cannot find dog ${params.name}` };
};

export const addDog = async ({
  request,
  response,
}: {
  request: any;
  response: any;
}) => {
  const body = await request.body();
  const dog: Dog = body.value;
  dogs.push(dog);

  response.status = 201;
  response.body = { msg: "Created" };
};

export const updateDog = async ({
  params,
  request,
  response,
}: {
  params: {
    name: string;
  };
  request: any;
  response: any;
}) => {
  const temp = dogs.filter((existingDog) => existingDog.name === params.name);
  const body = await request.body();
  const { age }: { age: number } = body.value;

  if (temp.length) {
    temp[0].age = age;
    response.status = 200;
    response.body = { msg: "OK" };
    return;
  }
  response.status = 204;
  response.body = { msg: `No dog ${params.name}` };
};

export const removeDog = ({
  params,
  response,
}: {
  params: {
    name: string;
  };
  response: any;
}) => {
  const lengthBefore = dogs.length;
  dogs = dogs.filter((dog) => dog.name !== params.name);

  if (dogs.length === lengthBefore) {
    response.status = 404;
    response.body = { msg: `Cannot find dog ${params.name}` };
    return;
  }
  response.status = 204;
  response.body = { msg: "No Content" };
};

const router = new Router();

router.get("/dogs", getDogs)
  .get("/dogs/:name", getDog)
  .post("/dogs", addDog)
  .put("/dogs/:name", updateDog)
  .delete("/dogs/:name", removeDog);

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

app.use(router.routes());
app.use(router.allowedMethods());

// console.log(`Listening on port ${PORT}...`);

await app.listen(`${HOST}:${PORT}`);
