<template>
<div class="login-block">
    <div class="login-img"><img src="/background_login.jpg" alt=""></div>
    <div class="login-main" style="flex-direction: column">
        <div class="login-another">
            <p class="register">
                Don't have an account yet?
                <nuxt-link to="/register">Create one</nuxt-link>
            </p>
        </div>
        <AuthForm title="Login" @submit.prevent="login">
            <AuthInput v-model="email" label="Email" :required="true" :error="email_error"/>
            <AuthInput v-model="password" label="Password" type="password" :required="true" />
            <div class="auth-form-footer">
                <div class="form-block">
                    <input class="form-control btn" type="submit" name="submit" value="Sign In" />
                </div>
                <nuxt-link to="/forgot-password" class="forgot">Forgot Password?</nuxt-link>
            </div>
        </AuthForm>
    </div>
</div>
</template>

<script lang="ts">
import {
    Component,
    Mixins
} from 'vue-property-decorator'

import {
    AuthMixin
} from '../mixins/auth'

@Component({
    middleware: "guest",
    components: {},
})
export default class Login extends Mixins(AuthMixin) {}
</script>

<style lang="less">
.login-block {
    position: fixed;
    inset: 0;
    background-color: #fff;
    display: flex;

    .login-img {
        width: 50%;    
        height: 100%;
        .img {
            height: 100%;
        }
    }

    a {
        text-decoration: none;
        color: rgb(119, 85, 229);
    }

    a:hover {
        text-decoration: underline;
    }

    .login-main {
        z-index: 2;
        flex: 1;
        background-color: #fff;
        padding: 20px;

        .login-another {
            margin: 40px 0;
            display: flex;
            width: 100%;
            justify-content: flex-end;
            height: 40px;
            .register {
                justify-content: end;
                text-align: right;
                font-size: 14px;
            }
        }
    }
}
</style>
