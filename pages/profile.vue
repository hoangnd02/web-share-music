<template>
<div>
    <div class="container" style="padding-bottom: 90px;">
        <div class="profile-container">
            <div class="profile-container-banner">
                <div class="profile-container-banner-background">
                    <div class="profile-container-banner-avatar">
                        <img v-if="user" :src="'api/v2/public/users/' + user.uid + '/avatar'" alt="">
                    </div>
                    <div v-if="user" class="profile-container-banner-name">
                        {{user.first_name + ' ' + user.last_name}}
                    </div>
                </div>
            </div>
            <div class="profile-container-nav">
                <div class="profile-container-nav-left">
                    <div class="profile-container-nav-item" @click="nav(2)">
                        My Musics
                    </div>
                    <div class="profile-container-nav-item" @click="nav(1)">
                        Liked Musics
                    </div>
                    <div class="profile-container-nav-item" @click="nav(0)">
                        My Albums
                    </div>
                </div>
                <div class="profile-container-nav-right">
                    <div class="profile-container-nav-item">
                        <NuxtLink to="/update-profile">
                            <i class="fas fa-edit"></i>
                            Edit
                        </NuxtLink>
                    </div>
                </div>
            </div>
            <div class="profile-container-content" >
                <div v-if="indexNav === 2" class="profile-container-content-left" style="padding: 10px 30px; display: block;">
                    <div v-for="(likedMusic, index) in myMusics" :key="index">
                        <SongItem2 :song="likedMusic" :type="'update-music'"/>
                    </div>
                </div>
                <div v-else-if="indexNav === 1" class="profile-container-content-left" style="padding: 10px 30px; display: block;">
                    <div v-for="(likedMusic, index) in likedMusics" :key="index">
                        <SongItem2 :song="likedMusic" />
                    </div>
                </div>
                 <div v-else class="profile-container-content-left" style="padding: 10px 30px; display: block;">
                    <!-- <div class="profile-container-content-left-img">
                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPAAAACnBAMAAADd8MzuAAAAJ1BMVEUAAADt7e3v7+/u7u7u7u7v7+/V1dXu7u7v7+/v7+/u7u7u7u7t7e1+coy7AAAADXRSTlMAK4/V8v8GlP29LPOQA9OSagAAAOlJREFUeAHt3CVCBQEUBdCLdxIR3QEkIgvAXRuVRMatswESGVkC68It/jQPOfeP20mjf+Yl6R2dbzgTA0myfTzfeJZ2k+7L+YIsb6VnviQ76auBLzJSA89krAaezX0NvJqXbhrOiwkGg8FgMBgMBoP/E9zV+gpgMBgMBr9MmPq3MBgMBoPB3wb+Hvzd+1MwGAwGf+uDwWDwN/IlLcCfmQKDweDKIxcYDHbvBAaDwWB/hjQAg8FgMLjgfS4wGAwGg30LAwaDwWAwGFxW16euktFDDTyT6xp4v6w+V1lFsroabMnVeNPu7UDyBMXh8J9inpNdAAAAAElFTkSuQmCC" alt="">

                    </div>
                    <div class="profile-container-content-left-title">
                        <div>
                            Seems a little quiet over here 2222
                        </div>
                        <a href="profile-container-content-left-title-link">
                            Upload a track to share it with your followers.
                        </a>
                    </div>
                    <div class="profile-container-content-left-button">
                        <a href="">
                            Upload now
                        </a>
                    </div> -->
                    <div v-for="(albumItem, index) in album" :key="index"  class="modal-box-list-item">
                        <AlbumItem3 :album="albumItem" />
                        
                    </div>
                </div>
                <div class="profile-container-content-right">
                    <div class="profile-container-content-right-follow">
                        <div class="profile-container-content-right-follow-item">
                            <span style="margin-right: 6px;">{{myMusics.length}}</span>
                            Tracks
                        </div>
                        <div class="profile-container-content-right-follow-item">
                            <div class="profile-container-content-right-info-like">
                            {{likedMusics.length}}<i class="fas fa-heart"></i>
                        </div>
                        </div>
                        <div class="profile-container-content-right-follow-item">
                            <span style="margin-right: 6px;">{{album.length}}</span>
                            Albums
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    Component,
    Mixins
} from 'vue-property-decorator'
import { Context } from '@nuxt/types';
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import store from "../controllers/store";
import MusicMixin from '~/mixins/music';
import ApiClient from "@/library/ApiClient"

@Component({
    middleware: ["auth", "album"],
    components: {
        Header,
        Footer
    },
})
export default class Profile extends Mixins(MusicMixin) {
    layout() {
        return 'music'
    }

    indexNav: number = 2
    likedMusics = [];
    myMusics: any = []
    album: any[] = []

    get user() {
        return store.value.user;
    }

    get currentSong() {
        return store.value.currentSong
    }

    get getAllAlbums() {
        return store.value.albums
    }

    nav(index: number) {
        this.indexNav = index
    }

    mounted() {
        store.value.isMusicDetail = "position: absolute; top: -500px;"
    }

    async asyncData({$axios}: Context) {
        const {data} = await new ApiClient($axios).get(`public/users/${store.value.user?.uid}/liked/musics`)
        let myMusicsUploaded: any = []
        if(store.value.user?.role !== "member") {
            myMusicsUploaded = await new ApiClient($axios).get(`resource/musics`)
        }
        const myAlbums = await new ApiClient($axios).get(`resource/albums`)
        return {
            likedMusics: data,
            myMusics: myMusicsUploaded.data,
            album: myAlbums.data
        }
    }
    
}
</script>

<style lang="less">
.container {
    background-color: #f2f4f8;
    display: flex;
    justify-content: center;
    padding-bottom: 90px;

    .profile-container {
        width: 80%;
        display: flex;
        flex-direction: column;
        margin: auto;
        background-color: #fff;

        &-content {
            display: flex;
            min-height: 414px;

            &-left {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                padding: 80px 30px;
                width: 70%;
                border-right: 1px solid #f2f2f2;

                &-button {
                    background-color: #4cb6cb;
                    border-color: #4cb6cb;
                    color: #fff;
                    padding: 10px;
                    border-radius: 6px;

                    a {
                        text-decoration: none;
                        color: #fff;
                    }
                }

                &-title {
                    text-align: center;
                    line-height: 40px;

                    a {
                        text-decoration: none;
                        color: #38d;
                    }

                    a:hover {
                        color: #000
                    }
                }
            }

            &-right {
                flex: 1;
                color: #999;
                padding: 10px 30px;

                &-follow {
                    display: flex;
                    justify-content: space-between;
                    padding-top: 10px;
                    padding-bottom: 10px;
                    margin: 0 -20px;
                    margin-bottom: 30px;
                    text-align: center;

                    &-item {
                        flex: 1;
                        padding: 0 20px;
                    }
                }

                &-info {
                    &-like {

                        i {
                            margin-left: 10px;
                            color: red;
                        }
                    }

                    &-song {
                        display: flex;

                        &-avatar {
                            padding: 0 10px;
                        }

                        &-text {
                            &-name {
                                font-size: 14px;
                            }

                            &-author {
                                color: #999;
                                font-size: 12px;
                            }

                            &-list {
                                display: flex;
                                padding: 4px 0;

                                &-item {
                                    margin-right: 20px;
                                    font-size: 14px;

                                    i {
                                        color: #999;
                                        margin-right: 6px;
                                        zoom: 0.8;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        &-banner {
            &-background {
                width: 100%;
                height: 260px;
                padding: 30px;
                display: flex;
                background: linear-gradient(315deg, rgb(250, 250, 250) 0%, rgb(50, 166, 141) 100%);

                .profile-container-banner-avatar {
                    display: flex;
                    align-items: center;
                    height: 100%;
                    margin-right: 50px;

                    img {
                        border-radius: 50%;
                        height: 160px;
                        width: 160px;
                        object-fit: cover;
                    }
                }

                .profile-container-banner-name {
                    flex: 1;
                    color: #fff;
                    font-weight: 400;
                    font-size: 30px;
                    line-height: 37px;
                    padding: 4px 7px;
                    display: flex;
                    align-items: center;
                }

                .profile-container-banner-upload {
                    display: flex;
                    height: 30px;

                    a {
                        color: #000;
                    }

                    label {
                        border: 1px solid #fff;
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

                    .custom-file-upload {
                        border: 1px solid #ccc;
                        display: inline-block;
                        padding: 6px 12px;
                        cursor: pointer;
                    }
                }
            }
        }

        &-nav {
            display: flex;
            margin: 0 20px;
            justify-content: space-between;
            border-bottom: 1px solid #f2f2f2;
            cursor: pointer;

            &-left,
            &-right {
                display: flex;

                .profile-container-nav-item {
                    padding: 14px 24px;
                    border: none;
                    border-bottom: 2px solid transparent;

                    a {
                        text-decoration: none;
                        color: #000;
                        display: flex;

                        i {
                            color: #4cb6cb;
                            margin-right: 6px;
                        }
                    }
                }

                .profile-container-nav-item:hover {
                    border-bottom: 2px solid #4cb6cb;
                    background-color: #f2f2f2;
                }
            }
        }

    }
}
</style>
