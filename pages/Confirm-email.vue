<template>
<div class="container" style="padding: 42px">
    <div class="update-profile-container" style="display: flex">
        <div class="update-profile-container-right">
            <AuthForm title="Confirm email" @submit.prevent="sendEmailCode">
                <div style="display: flex">
                    <div>
                        OTP will send to your email 
                        <span style="color: #6039de">
                            {{user.email}}
                        </span>
                    </div>
                    <div style="min-width: 120px">
                        <button type="submit" class="update-profile-container-right-form-btn-button">
                            Send code
                        </button>
                    </div> 
                </div>
            </AuthForm >
            <AuthForm class="update-profile-container-right-form" 
                @submit.prevent="confirmEmail" 
            >
                <AuthInput v-model="code" label="Confirm your password" :required="true" />
                <div class="update-profile-container-right-form-btn">
                    <button type="submit" class="update-profile-container-right-form-btn-button">Submit</button>
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
} from '../mixins';
import store from '~/controllers';

@Component({
    components: {},
})
export default class Change_Password extends Mixins(AuthMixin) {
    layout() {
        return 'music'
    }

    user: any = '';

    data() {
        this.user = store.value.user
        return {
            user: this.user,
        }
    }
}
</script>

<style lang="less">
.container {
    background-color: #f2f4f8;
    display: flex;
    justify-content: center;
    padding: 30px;

    .update-profile-container {
        width: 80%;
        display: flex;
        margin: auto;
        background-color: #fff;
        padding: 40px 20px;

        &-left {
            width: 30%;
            border-right: 1px solid #f2f2f2;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            &-img {
                text-align: center;

                img {
                    width: 160px;
                    margin-bottom: 20px;
                }

                label {
                    border: 1px solid #f2f2f2;
                    padding: 10px;
                    background-color: #fff;
                    color: #000;
                    display: flex;
                    align-items: center;

                    i {
                        margin-right: 10px;
                        color: #4cb6cb;
                    }
                }

                input[type="file"] {
                    display: none;
                }
            }
        }

        &-right {
            flex: 1;
            padding: 20px 60px;

            &-form {
                &-input {
                    margin: 20px 0;
                    display: flex;
                    align-items: center;

                    span {
                        width: 160px;
                        display: block;
                    }

                    input {
                        flex: 1;
                        padding: 0 12px;
                        width: 100%;
                        height: 46px;
                        display: block;
                        background-color: #f5f7f9;
                        border: 1px solid #fff;
                        border-radius: 5px;
                        outline: none;
                    }
                }

                &-btn {
                    display: flex;
                    justify-content: center;
                    margin-top: 60px;

                    &-button {
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
    }
}
</style>