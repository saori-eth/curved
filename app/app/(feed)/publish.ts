"use server";

export async function publish(data: FormData) {
  const title = data.get("title") ?? "";
  const description = data.get("description") ?? "";

  console.log("publish", { description, title });
}
