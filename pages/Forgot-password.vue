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
        <div v-if="sentEmail === 0">
            <AuthForm title="Quên mật khẩu" class="update-profile-container-right-form" @submit.prevent="generate_code">
                <AuthInput v-model="email" label="Nhập email của bạn" :required="true" />
                <div class="update-profile-container-right-form-btn">
                    <button type="submit" class="update-profile-container-right-form-btn-button">Submit</button>
                </div>
            </AuthForm>
        </div>
        <div v-else-if="sentEmail === 1">
            <AuthForm title="Quên mật khẩu" @submit.prevent="reset_password">
                <div>
                    <div>
                        OTP will send to your email
                        <span style="color: #6039de">
                            {{email}}
                        </span>
                    </div>
                    <AuthInput v-model="code" label="Nhập mã otp" :required="true" />
                    <AuthInput v-model="newPassword" label="NHập mật khẩu mới" :required="true" />
                    <div class="update-profile-container-right-form-btn">
                        <button type="submit" class="update-profile-container-right-form-btn-button">
                            Send code
                        </button>
                    </div>
                </div>
            </AuthForm>
        </div>
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
import ApiClient from '~/library/ApiClient'

@Component({
    middleware: "guest",
    components: {},
})
export default class Login extends Mixins(AuthMixin) {
    sentEmail: number = 0
    email: string = ""
    code: string = ""
    newPassword: string = ""

    setSentEmail() {
        this.sentEmail = this.sentEmail + 1
    }

    async generate_code() {
        try {
            await new ApiClient().post('identity/users/generate_code', {
                email: this.email
            });
            this.sentEmail += 1;
        } catch (error) {
            return error
        }
    }

    async reset_password() {
        if (this.code.length <= 5) return

        try {
            await new ApiClient().post('identity/password/reset_password', {
                email: this.email,
                code: this.code,
                password: this.newPassword,
                confirm_password: this.newPassword
            });
            this.$router.push("/login")
        } catch (error) {
            return (error);
        }
    }
}
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

        .update-profile-container-right-form-btn {
            display: flex;
            justify-content: center;
            margin-top: 60px;

            .update-profile-container-right-form-btn-button {
                padding: 10px 20px;
                background-color: #4cb6cb;
                outline: none;
                border: none;
                border-radius: 20px;
                color: #fff;
            }
        }
    }
}
</style>
