import { Context } from "@nuxt/types";
import store from "~/controllers";

export default (context: Context) => {
    context.app.router?.beforeEach((_to, _from, next) => {
      if (store.first_route) {
        store.first_route = false;
      }

      next();
    });
}