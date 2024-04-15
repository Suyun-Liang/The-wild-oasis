import { CreateGetGuest } from "./apiGuests";
import supabase, { supabaseUrl } from "./supabase";

export async function signup({
  fullName,
  email,
  password,
  role = "user",
  guestData,
}) {
  let query;
  let data;

  if (role === "admin") {
    query = supabase.auth.signUp({
      email,
      password,
      options: { data: { fullName, avatar: "", role } },
    });
    const { data: adminData, error } = await query;
    if (error) throw new Error(error.message);
    data = adminData;
  }

  if (role === "user") {
    query = supabase
      .from("guests")
      .select("*", { count: "exact", head: true })
      .eq("nationalID", guestData.nationalID);
    const { count, error } = await query;

    if (count === 0) {
      query = supabase.auth.signUp({
        email,
        password,
        options: { data: { fullName, avatar: "", role, guestData } },
      });
      const { data: userData, error } = await query;
      if (error) throw new Error(error.message);
      data = userData;
    } else {
      throw new Error(
        "user already exist, please log in or use another account"
      );
    }

    if (error) throw new Error(error.message);
  }

  return data;
}

export async function login({ email, password }) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getCurrentUser() {
  const { data: session } = await supabase.auth.getSession();

  if (!session.session) return null;

  const { data, error } = await supabase.auth.getUser();

  if (error) throw new Error(error.message);

  return data?.user;
}

export async function logout() {
  const { error } = await supabase.auth.signOut();

  if (error) throw new Error(error.message);
}

export async function updateCurrentUser({
  password,
  fullName,
  avatar,
  guestData,
}) {
  //1.update password or fullName
  let updateData;
  if (password) updateData = { password };
  if (fullName) updateData = { data: { fullName } };
  if (guestData) updateData = { data: { guestData } };

  const { data, error } = await supabase.auth.updateUser(updateData);

  if (error) throw new Error(error.message);

  //2.upload the avatar img
  if (!avatar) return data;

  const fileName = `avatar-${data.user.id}-${Math.random()}`;
  const avatarFile = avatar;
  const { error: storageError } = await supabase.storage
    .from("avatars")
    .upload(fileName, avatarFile);

  if (storageError) throw new Error(storageError.message);

  //3.update avatar in the user
  const url = `${supabaseUrl}/storage/v1/object/public/avatars/${fileName}`;
  const { data: updatedUserData, error: updateError } =
    await supabase.auth.updateUser({
      data: {
        avatar: url,
      },
    });
  if (updateError) throw new Error(updateError.message);

  return updatedUserData;
}
