// lib/getUser.ts
import axios from "axios";
import { BACKEND_PATHS } from "@/utilites/urls";

export async function getUser(cookieHeader?: string) {
  if (!cookieHeader) return null; // --- нет куки, сразу возвращаем null

  try {
    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_DOCKER_API_BASE_URL}${BACKEND_PATHS.me}`, {
      headers: { cookie: cookieHeader },
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.log(err)
    return null;
  }
}
