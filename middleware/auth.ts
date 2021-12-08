import { Context } from "@nuxt/types";
import store from "@/controllers";

export default function (context: Context) {
  if (!store.value.user.uid) {
    context.redirect("/")
  }
}
