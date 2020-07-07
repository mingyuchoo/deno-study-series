import { Router } from "https://deno.land/x/oak/mod.ts";
import db from "../helpers/db.ts";

export const selectAllPeople: any = async (context: any) => {
  try {
    //const rows = await db.query("SELECT name FROM people;");
    //context.response.body = rows;
    let data = [];
    for (const [id, name] of db.query("SELECT id, name FROM people;")) {
      data.push({ id: id, name: name });
    }
    context.response.body = { status: "OK", data: data };
    context.response.status = 200;
  } catch (error) {
    context.response.body = null;
    context.response.status = 500;
    console.log(error.message);
    console.log(error.code);
    console.log(error.codeName);
  }
};

export const selectOnePerson: any = async (context: any) => {
  try {
    // accessing the id of friend from the request params
    let id: string = context.params.id;

    let data: any;

    for (
      const [_id, _name] of db.query(
        "SELECT id, name FROM people WHERE Id = :id;",
        { id },
      )
    ) {
      data = { id: _id, name: _name };
    }
    if (data) {
      context.response.body = data;
      context.response.status = 200;
    } else {
      context.response.body = null;
      context.response.status = 404;
    }
  } catch (error) {
    context.response.body = null;
    context.response.status = 500;
    console.log(error.message);
    console.log(error.code);
    console.log(error.codeName);
  }
};

export const insertOnePerson: any = async (context: any) => {
  try {
    // acessing data from the request body
    let body: any = await context.request.body();
    const { name } = body.value;

    await db.query("INSERT INTO people (name) VALUES (:name)", { name });

    context.response.body = { status: "Created" };
    context.response.status = 201;
  } catch (error) {
    context.response.body = null;
    context.response.status = 500;
    console.log(error.message);
    console.log(error.code);
    console.log(error.codeName);
  }
};

export const updateOnePerson: any = async (context: any) => {
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
};

export const deleteOnePerson: any = async (context: any) => {
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
};

const peopleRouter = new Router();
peopleRouter
  .get("/people", selectAllPeople)
  .post("/people", insertOnePerson)
  .get("/people/:id", selectOnePerson)
  .put("/people/:id", updateOnePerson)
  .delete("/people/:id", deleteOnePerson);

export default peopleRouter;
