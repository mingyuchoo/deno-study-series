import { Router } from "https://deno.land/x/oak/mod.ts";
import db from '../config/db.ts';

// Declare the collections here. Here we are using only one collection (i.e friends).
const Friend = db.collection("friends");


// This is the function that gets the data of a friend from the database.
export const selectAllFriend: any = async(context: any)=> {
  try{
    // searching the db for a friend with the given id
    const data :any = await Friend.find({});
    if(data){       // Response if friend is found
      context.response.body = data;
      context.response.status = 200;
    } else {        // Response if no friend exits with the given id
      context.response.body = "not found";
      context.response.status = 204;
    }
  }
  // if some error occured while searching the db
  catch(e) {
    context.response.body = null;
    context.response.status = 500
    console.log(e);
  }
}

// This is the function that adds a friend to the database.
export const insertFriend: any = async(context: any) => {
  try{
    // acessing data from the request body
    let body: any = await context.request.body();
    const {name, pno, email} = body.value;

    // inserting into the db
    const id = await Friend.insertOne({
      name: name,
      pno: pno,
      email: email
    });

    // sending the response
    context.response.body = id;
    context.response.status = 201;
  }
  // when the insertion fails
  catch(e) {
    context.response.body = null;
    context.response.status = 500;
    console.log(e);
  }
}

// This is the function that gets the data of a friend from the database.
export const selectOneFriend: any = async(context: any)=> {
  try{
    // accessing the id of friend from the request params
    let id: string = context.params.id;

    // searching the db for a friend with the given id
    const data :any = await Friend.findOne({_id: {"$oid": id}});
    if(data){       // Response if friend is found
      context.response.body = data;
      context.response.status = 200;
    } else {        // Response if no friend exits with the given id
      context.response.body = "not found";
      context.response.status = 204;
    }
  }
  // if some error occured while searching the db
  catch(e) {
    context.response.body = null;
    context.response.status = 500
    console.log(e);
  }
}


// This is the function that updates the data of a friend in the database.
export const updateFriend:any = async(context: any) => {
  try{
    // accessing the id of friend from the request params
    const id :string = context.params.id;
    // acessing data from the request body
    let body :any = await context.request.body()

    // creating the data object which has the updated values
    let data :{email?: String, pno?: String} = {};
    if(body.value.email){       // if an updated email id is sent
      data["email"] = body.value.email;
    }
    if(body.value.pno){         // if an updated phone no is sent
      data["pno"] = body.value.pno;
    }

    // Updating the database
    const result = await Friend.updateOne({_id: {"$oid": id}}, {$set: data});

    // sending the response
    context.response.body = result;
    context.response.status = 200;
  }
  // if some error occured while updating
  catch(e){
    context.response.body = null;
    context.response.status = 500
    console.log(e);
  }
}

// This is the function that deletes a friend from the database.
export const deleteFriend: any = async(context: any) => {
  try{
    // accessing the id of friend from the request params
    let id :string = context.params.id;

    // deleting the friend with the given id from the db
    const result = await Friend.deleteOne({_id: {"$oid": id}});
  /*
  * result = 0 : data not found
  * result = 1 : data found and deleted
  */
  // sending the response
    context.response.body = {result};
    context.response.status = 200;
  }
  // if some error occured while deletion
  catch(e) {
    context.response.body = null;
    context.response.status = 500
    console.log(e);
  }
}

const friendsRouter = new Router();

friendsRouter
  .get("/friends", selectAllFriend)
  .post("/friends", insertFriend)
  .get("/friends/:id", selectOneFriend)
  .put("/friends/:id", updateFriend)
  .delete("/friends/:id", deleteFriend);

export default friendsRouter;