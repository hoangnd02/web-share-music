import { Context } from "@nuxt/types";
import store from "@/controllers/store";
import ApiClient from "@/library/ApiClient"

export default async function (context: Context) {
  if(store.value.getLogged === true) return
    try {
      if(!store.value.user) {
        const {data} = await new ApiClient(context.$axios).get("resource/users/me")
        store.value.user = data
        store.value.getLogged = true
      }
    
      if (context.route.path === '/confirm-email' && store.value.user?.state === 'pending') {
        return
      } 
      // else if (store.value.user?.state === 'pending') {
      //   context.redirect("/confirm-email")
      // }
    } catch (error) {
      store.value.getLogged = true
      store.value.user = null;
      return error;
    }
}