import supabase from "./supabase";

export async function CreateGetGuest(newGuestObj) {
  const { nationalID } = newGuestObj;
  let query = supabase.from("guests");

  //1. search if guest's nationalID exists in table
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

  if (errorGuest) throw new Error(errorGuest.message);

  return data;
}
