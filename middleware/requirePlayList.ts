import { Context } from "@nuxt/types";
import store from "@/controllers";

export default function (context: Context) {
    if (store.value.playlist.length === 0) {
        context.redirect("/");
    }
}
