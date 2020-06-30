import { DB } from "https://deno.land/x/sqlite/mod.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { green, yellow } from "https://deno.land/std@0.53.0/fmt/colors.ts";

const port = 4000;
const app = new Application();
const router = new Router();

// Open a database
const db = new DB("test.db");
db.query("DROP TABLE IF EXISTS people");
db.query(
  "CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)",
);

router.get("/", (context: any) => {
  try {
    const rows = db.query("SELECT name FROM people;");
    context.response.body = rows;
    context.response.status = 200;
  } catch (error) {
    context.response.body = null;
    context.response.status = 500;
    console.log(error.message);
    console.log(error.code);
    console.log(error.codeName);
  }
});

router.get("/:id", (context: any) => {
  try {
    // accessing the id of friend from the request params
    let id: string = context.params.id;

    const [name] = db.query("SELECT name FROM people WHERE id = :id", { id });

    context.response.body = name;
    context.response.status = 200;
  } catch (error) {
    context.response.body = null;
    context.response.status = 500;
    console.log(error.message);
    console.log(error.code);
    console.log(error.codeName);
  }
});

router.post("/", async (context: any) => {
  try {
    // acessing data from the request body
    let body: any = await context.request.body();
    const { name } = body.value;

    db.query("INSERT INTO people (name) VALUES (:name)", { name });

    context.response.body = { status: "Created" };
    context.response.status = 201;
  } catch (error) {
    context.response.body = null;
    context.response.status = 500;
    console.log(error.message);
    console.log(error.code);
    console.log(error.codeName);
  }
});

router.put("/:id", async (context: any) => {
  try {
    // accessing the id of friend from the request params
    let id: string = context.params.id;

    // acessing data from the request body
    let body: any = await context.request.body();
    const { name } = body.value;

    db.query("UPDATE people SET name = :name WHERE id = :id", { name, id });

    context.response.body = { status: "Updated" };
    context.response.status = 200;
  } catch (error) {
    context.response.body = null;
    context.response.status = 500;
    console.log(error.message);
    console.log(error.code);
    console.log(error.codeName);
  }
});

router.delete("/:id", async (context: any) => {
  try {
    // accessing the id of friend from the request params
    let id: string = context.params.id;

    db.query("DELETE FROM people WHERE id = :id", { id });

    context.response.body = { status: "Deleted" };
    context.response.status = 200;
  } catch (error) {
    context.response.body = null;
    context.response.status = 500;
    console.log(error.message);
    console.log(error.code);
    console.log(error.codeName);
  }
});

app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ secure, hostname, port }) => {
  const protocol = secure ? "https://" : "http://";
  const url = `${protocol}${hostname ?? "localhost"}:${port}`;
  console.log(
    `${yellow("Listening on:")} ${green(url)}`,
  );
});

await app.listen({ port });

// Close connection
db.close();
