import { Context } from "@nuxt/types";
import store from "@/controllers";
import ApiClient from "@/library/ApiClient"

export default async function (context: Context) {
  if(!store.value.albums) {
    try {
      const {data} = await new ApiClient(context.$axios).get("resource/albums")
      store.value.albums = data
    } catch (error) {
      return error;
    }
  }
}
