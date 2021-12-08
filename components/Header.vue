<template>
    <header class="header">
        <div class="header-logo">
            <nuxt-link to="/" class="header-logo-link">
                <i class="fas fa-headphones"></i>
            </nuxt-link>
        </div>
        <form class="header-form" role="search">
            <div class="header-form-search">
                <div class="header-form-search-input">
                    <client-only>
                    <form class="header-form-search-icon" @submit.prevent="redirectSearchPage">
                        <button type="submit">
                            <i class="fas fa-search"></i>
                        </button>
                        <input v-model="name" type="text" class="" placeholder="Search songs, albums..." />
                    </form>
                    </client-only>
                </div>
            </div>
        </form>
        <div class="header-right">
            <ul class="header-right-list">
                <nuxt-link v-if="user && user.role === 'admin'" to="/upload-music" class="header-right-upload">
                    <i class="fas fa-cloud-upload-alt"></i>Upload
                </nuxt-link>
                <li class="header-right-user">
                    <div class="header-right-user-link" data-toggle="dropdown">
                        {{user.state && user.first_name + ' ' + user.last_name}}
                        <span>
                            <img v-if="user.uid" :src="'/api/v2/public/users/' + user.uid + '/avatar'" alt="..."/>
                            <img v-else src="/Placeholder.jpg" alt="">
                        </span>
                        <ul v-if="!user.state" class="header__navbar-user-menu" >
                            <li class="header__navbar-user-item">
                                <!-- <nuxt-link to="/profile">Tài khoản của tôi</nuxt-link> -->
                            </li>
                            <li class="header__navbar-user-item header__navbar-user-item--separate">
                                <nuxt-link to="/login" class="header__navbar-user-item-link">Login</nuxt-link>
                            </li>
                            <li class="header__navbar-user-item header__navbar-user-item--separate">
                                <nuxt-link to="/register" class="header__navbar-user-item-link">Register</nuxt-link>
                            </li>
                        </ul>
                        <ul v-else class="header__navbar-user-menu">
                            <li class="header__navbar-user-item header__navbar-user-item--separate">
                                <nuxt-link to="/profile" class="header__navbar-user-item-link">My profile</nuxt-link>
                            </li>
                            <li v-if="user.state !== 'active'" class="header__navbar-user-item header__navbar-user-item--separate">
                                <nuxt-link to="/confirm-email" class="header__navbar-user-item-link">Comfirm email</nuxt-link>
                            </li>
                            <li class="header__navbar-user-item header__navbar-user-item--separate">
                                <nuxt-link to="/change-password" class="header__navbar-user-item-link">Change password</nuxt-link>
                            </li>
                            <li class="header__navbar-user-item header__navbar-user-item--separate">
                                <div class="header__navbar-user-item-link" @click="logout">Logout</div>
                            </li>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </header>
</template>

<script lang="ts">
import {
    Component,
    Mixins
} from 'vue-property-decorator';
import store from "../controllers";
import { AuthMixin } from '~/mixins';
import { User } from '~/types';

@Component
export default class Header extends Mixins(AuthMixin) {
    user: User | null = null;
    name: string = ""

    get userStore() {
        return store.value.user
    }
    
    data() {
        this.user = store.value.user

        return {
            user: this.user,
        }
    }

    redirectSearchPage() {
        if(this.name === '') return 
        if(this.$route.path === "/search/find") {
           this.$router.replace({
               path: "/search/find",
               query: {
                   name: this.name
               }
           })
        } else {
            this.$router.push(`/search/find?name=${this.name}`)
        }
    }
}
</script>

<style lang="less">
.header {
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    height: 60px;

    .header-logo {
        background-color: #4cb6cb;
        width: 70px;

        .header-logo-link {
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            text-decoration: none;

            svg {
                height: 10px;
                color: #fff;
                zoom: 2;
            }
        }
    }

    .header-right {
        display: flex;
        align-items: center;

        .header-right-list {
            display: flex;
            list-style: none;
            
            .header-right-upload {
                display: flex;
                align-items: center;
                color: #545a5f;
                cursor: pointer;

                i {
                    margin-right: 10px;
                }
            }

            .header-right-user {
                width: 180px;
                padding: 4px 20px;

                &-link {
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    color: #545a5f;
                    font-size: 14px;
                    position: relative;
                    justify-content: flex-end;

                    .header__navbar-user-menu {
                        position: absolute;
                        padding-left: 0;
                        top: calc(100% + 6px);
                        border-radius: 2px;
                        width: 160px;
                        background-color: #fff;
                        list-style: none;
                        box-shadow: 0 1px 2px #e0e0e0;
                        z-index: 4;
                        font-size: 14px;
                        display: none;

                        .header__navbar-user-item--separate {
                            border-top: 1px solid rgba(0, 0, 0, 0.05);
                        }

                        .header__navbar-user-item {
                            z-index: 5;

                            &-link {
                                text-decoration: none;
                                color: #000;
                                font-size: 14px;
                                padding: 4px 16px;
                                display: block;
                                cursor: pointer;
                            }

                            &-link:first-child {
                                border-bottom-left-radius: 2px;
                                border-bottom-right-radius: 2px;
                            }

                            &-link:last-child {
                                border-top-left-radius: 2px;
                                border-top-right-radius: 2px;
                            }

                            &-link:last-child:hover {
                                background-color: #f8f8f8;
                            }
                        }
                    }

                    .header__navbar-user-menu::before {
                        content: "";
                        border-width: 20px 25px;
                        border-style: solid;
                        border-color: transparent transparent #fff transparent;
                        position: absolute;
                        top: -30px;
                        right: 0;
                        z-index: -1;
                    }

                    .header__navbar-user-menu::after {
                        content: "";
                        display: block;
                        position: absolute;
                        top: -8px;
                        right: 0;
                        width: 56%;
                        height: 8px;
                    }

                    b {
                        font-weight: bold;
                        margin-left: 6px;
                    }

                    span {
                        margin-left: 14px;

                        img {
                            border-radius: 500px;
                            height: 40px;
                            width: 40px;
                            object-fit: cover;
                        }
                    }
                }

                &-link:hover .header__navbar-user-menu {
                    display: block;
                }
            }

        }
    }

    .header-form {
        display: flex;
        align-items: center;
        flex: 1;
        padding: 0 15px;
        justify-content: center;

        .header-form-search {
            &-input {
                display: flex;
                width: 400px;

                .header-form-search-icon {
                    display: flex;
                    align-items: center;

                    button {
                        background-color: #fff;
                        border: none;
                        color: #788188;
                        padding: 15px 10px;
                        text-align: center;
                        text-decoration: none;
                        display: inline-block;
                    }
                }

                input {
                    margin: 15px 0;
                    height: 30px;
                    width: 100%;
                    padding: 5px 10px;
                    font-size: 14px;
                    line-height: 1.5;
                    border-radius: 3px;
                    outline: none;
                    border: none;
                }
            }
        }
    }

}
</style>
