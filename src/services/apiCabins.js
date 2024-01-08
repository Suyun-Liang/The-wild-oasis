import supabase, { supabaseUrl } from "./supabase";
import { ROOM_PAGE_SIZE } from "../utils/constants";

export async function getCabins({ pageParam, limitNum } = {}) {
  let query = supabase
    .from("cabins")
    .select("*", { count: "exact" })
    .order("name");

  if (pageParam) {
    const from = (pageParam - 1) * ROOM_PAGE_SIZE;
    const to = from + ROOM_PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  if (limitNum) {
    query = query.limit(limitNum);
  }

  const { data: cabins, error, count } = await query;

  if (error) {
    console.error(error);
    throw new Error("cabins could not be loaded");
  }

  return { cabins, count };
}
export async function getCabin(id) {
  if (!id) return;

  const { data, error } = await supabase
    .from("cabins")
    .select()
    .eq("id", id)
    .single();

  if (error) {
    console.error(error);
    throw new Error("cabin could not be loaded");
  }

  return data;
}

export async function deleteCabin(id) {
  const { data, error } = await supabase.from("cabins").delete().eq("id", id);

  if (error) {
    console.error(error);
    throw new Error("cabins could not be deleted");
  }

  return data;
}

export async function createEditCabin(newCabin, id) {
  const hasImagePath = newCabin.image?.startsWith?.(supabaseUrl);

  // Name has to be unique to store in superbase buckets
  const imageName = `${Math.random()}-${newCabin.image?.name}`.replaceAll(
    "/",
    ""
  );
  const imagePath = hasImagePath
    ? newCabin.image
    : `${supabaseUrl}/storage/v1/object/public/cabin-images/${imageName}`;
  //1. creat/edit cabin
  let query = supabase.from("cabins");
  //1.a create a cabin
  if (!id) query = query.insert([{ ...newCabin, image: imagePath }]);
  //1.b edit a cabin
  if (id) query = query.update({ ...newCabin, image: imagePath }).eq("id", id);

  const { data, error } = await query.select().single();

  if (error) {
    console.error(error);
    throw new Error("cabins could not be created");
  }

  // 2.upload image
  if (hasImagePath) return data;

  const { error: storageError } = await supabase.storage
    .from("cabin-images")
    .upload(imageName, newCabin.image);

  // 3. delete the cabin IF there is an error uploading the image
  if (storageError) {
    await supabase.from("cabins").delete().eq("id", data.id);
    console.error(storageError);
    throw new Error(
      "cabins image could not be uploaded and the cabin was not created"
    );
  }

  return data;
}

export async function getAvailableCabinIn({
  pageParam = 1,
  checkin,
  checkout,
}) {
  if (!checkin || !checkout) return getCabins({ pageParam });

  //1. get unavailable cabins
  const { data, error } = await supabase
    .from("bookings")
    .select("cabinId")
    .gt("endDate", checkin)
    .lt("startDate", checkout);
  if (error) throw new Error("there is error fetching cabin from booking");

  const rawCabins = data.map((e) => e.cabinId);

  const uniqueData = rawCabins
    .filter((e, i) => rawCabins.indexOf(e) === i)
    .join();

  //2. get available cabins
  let query = supabase
    .from("cabins")
    .select("*", { count: "exact" })
    .not("id", "in", `(${uniqueData})`)
    .order("id");

  // 3. pagination
  if (pageParam) {
    const from = (pageParam - 1) * ROOM_PAGE_SIZE;
    const to = from + ROOM_PAGE_SIZE - 1;
    query = query.range(from, to);
  }

  const { data: cabins, error: cabinError, count } = await query;

  if (cabinError) throw new Error("there is error fetching cabin");
  return { cabins, count };
}
