import vue from "vue";
import store from '~/controllers';

export * from './auth';
export * from './music';

if (process.client) {
    vue.prototype.Nstore = store;
}
