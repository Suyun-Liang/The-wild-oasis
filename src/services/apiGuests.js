import { guests } from "../data/data-guests";
import supabase from "./supabase";

export async function CreateGetGuest(newGuestObj) {
  const { nationalID } = newGuestObj;
  let query = supabase.from("guests");
  let guest;

  /*   //1. search if guest's nationalID exists in table
  const { error, count } = await query
    .select("*", { count: "exact", head: true }) // select count(nationalID)
    .eq("nationalID", nationalID); // where nationalID = <>

  if (error) throw new Error(error.message);

  //2. get guest if exists, otherwise insert a new row
  if (!count) {
    query = query.insert(newGuestObj);
  } else {
    query = query.select().eq("nationalID", nationalID);
  }

  const { data, error: errorGuest } = await query.select().single();

  if (errorGuest) throw new Error(errorGuest.message); */

  const { data: newGuest, error } = await query.insert(newGuestObj).select();

  if (error) {
    if (error.code === "23505") {
      const { data, error } = await query
        .select("*")
        .eq("nationalID", nationalID)
        .single();
      if (error) throw new Error(error.message);
      guest = data;
    } else {
      throw new Error(error.message);
    }
  }

  return newGuest || guest;
}

export async function deleteGuest(id) {
  const { error } = await supabase.from("guests").delete().eq("id", id);

  if (error) throw new Error(error.message);

  return null;
}
