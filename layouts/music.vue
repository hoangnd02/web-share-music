<template>
<div>
    <Header />
    <div class="container-music">
        <div class="container-music-listen" :style="isMusicDetail">
            <div class="container-music-listen-main">
                <div class="container-music-listen-main-left">
                    <div class="container-music-listen-main-left-top">
                        <div class="container-music-listen-main-left-top-play">
                            <i v-if="isPlaying" class="fa fa-pause" @click='play'></i>
                            <i v-else class="fa fa-play" @click='play'></i>
                        </div>
                        <div class="container-music-listen-main-left-top-name">
                            <div class="container-music-listen-main-left-top-name-song">{{currentSong.name}}</div>
                            <div class="container-music-listen-main-left-top-name-author">{{currentSong.author}}</div>
                        </div>
                        <div class="container-music-listen-main-left-top-info">
                            <div class="container-music-listen-main-left-top-info-time"></div>
                        </div>
                    </div>
                    <div class="container-music-listen-main-left-bot">
                        <div v-if="isLoading" class="loading">
                            <img  src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" style="width: 50px; height: 50px; justify-content: center;" />
                        </div>
                        <div id="hoang">
                        </div>
                    </div>
                </div>
                <div class="container-music-listen-main-right">
                    <img v-if="currentSong" :src="'/api/v2/public/musics/' + currentSong.id + '/image'" alt="">
                </div>
            </div>
        </div>
    </div>
    <Nuxt />
    <ZNotificationGroup />
    <div v-if="currentSong">
        <Footer />
    </div>
</div>
</template>

<script lang="ts">
import {
    Component,
    Vue,
} from 'nuxt-property-decorator'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import store from '~/controllers'

@Component({
    components: {
        Header,
        Footer
    },
})

export default class Music extends Vue {
    get wavesurfer(): any {
        return store.value.wavesurfer
    }

    get currentSong(): any {
        return store.value.currentSong
    }

    get isMusicDetail() {
        return store.value.isMusicDetail
    }

    get isPlaying() {
        return store.value.isPlaying
    }

    get isLoading() {
        return store.value.isLoading
    }

    head() {
        return {
            title: this.currentSong.name,
        }
    }

    mounted() {
        store.value.isMusicDetail = "position: absolute; top: -500px;"

        if(process.client){
            if(!store.value.currentSong && localStorage.getItem("currentSong")) {
                const songLocal: any = localStorage.getItem("currentSong")
                store.value.playlist = [JSON.parse(songLocal)]
                store.value.currentSong = store.value.playlist[0]
            }
        }
    }

    play() {
        store.value.isPlaying = !store.value.isPlaying
        this.wavesurfer.playPause()
    }
}
</script>

<style lang="less">

body {
    font-family: 'Roboto', sans-serif;
}

.container-music {
    background-color: #f2f4f8;
    display: flex;
    justify-content: center;
    flex-direction: row;
    max-width: 1200px;
    margin: auto;

    &-listen {
        width: 1200px;
        background-color: #fff;
        position: absolute; 
        top: -500px;

        &-main {
            padding: 30px 30px;
            width: 100%;
            display: flex;
            background-color: #625e51;

            &-left {
                width: 70%;
                display: flex;
                flex-direction: column;

                &-top {
                    display: flex;
                    height: 120px;

                    &-play {
                        border-radius: 50%;
                        border-color: #4cb6cb;
                        background-color: #4cb6cb;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        text-decoration: none;
                        height: 60px;
                        width: 60px;

                        i {
                            color: #fff;
                            zoom: 1.4;
                        }
                    }

                    &-name {
                        margin-left: 20px;
                        flex: 1;
                        color: #fff;

                        &-song {
                            font-size: 24px;
                            width: 70%;
                        }

                        &-author {
                            font-size: 16px;
                        }
                    }

                    &-info {
                        padding: 20px;
                        line-height: 30px;
                        color: #fff;
                        margin-right: 20px;

                        &-tag {
                            height: 30px;
                            line-height: 30px;
                            text-align: center;
                            border-radius: 20px;
                            background-color: #999;
                            margin-top: 20px;
                        }
                    }
                }

                &-bot {
                    padding-right: 40px;
                    display: flex;
                    flex-direction: column;
                    flex: 1;
                    justify-content: center;

                    .loading {
                        display: flex;
                        justify-content: center;
                    }

                    #hoang {
                        height: 128px;
                    }
                }
            }

            &-right {
                flex: 1;

                img {
                    width: 340px;
                    height: 340px;
                    object-fit: cover;
                    border-radius: 50%;
                }
            }
        }

        &-content {
            display: flex;
            padding: 30px;

            &-right {
                flex: 1;
                padding-left: 10px;

                &-title {
                    color: #999;
                    margin-bottom: 10px;

                    i {
                        margin-right: 6px;
                        padding-left: 10px;
                    }
                }

            }

            &-left {
                width: 70%;
                padding-right: 30px;
                border-right: 1px solid #f2f2f2;

                .comment-form {
                    border: 1px solid #e5e5e5;
                    display: flex;
                    height: 40px;
                    margin-bottom: 16px;
                    border-radius: 4px;

                    &-avatar {
                        img {
                            width: 40px;
                        }
                    }

                    &-input {
                        background-color: #f2f4f8;
                        flex: 1;
                        display: flex;
                        align-items: center;
                        padding: 0 10px;
                        height: 40px;

                        input {
                            padding: 0 8px;
                            height: 30px;
                            border: 1px solid #e5e5e5;
                            outline: none;
                            border-radius: 4px;
                            width: 100%;
                        }
                    }
                }

                .comment-detail {
                    margin-top: 20px;
                    display: flex;

                    &-left {
                        width: 200px;
                        padding-right: 20px;

                        &-author {
                            &-img {
                                img {
                                    width: 120px;
                                    border-radius: 500px;
                                }
                            }

                            &-name {
                                font-size: 16px;
                                color: #333 !important;
                                line-height: 30px;
                            }

                            &-follow {
                                line-height: 30px;
                                color: #999;

                                &-user {
                                    font-size: 14px;

                                    i {
                                        margin-right: 10px;
                                    }
                                }

                                &-button {
                                    background-color: #4cb6cb;
                                    padding: 0 10px;
                                    border-radius: 8px;
                                    width: 80px;
                                    font-size: 12px;
                                    color: #fff;

                                    i {
                                        margin-right: 6px;
                                    }
                                }
                            }
                        }
                    }

                    &-right {
                        flex: 1;
                        color: #999;

                        .comment {
                            &-count {
                                margin-bottom: 20px;

                                i {
                                    margin-right: 10px;
                                }
                            }

                            &-list {
                                &-item {
                                    display: flex;
                                    padding: 10px 0;

                                    &-avatar {
                                        margin-right: 10px;

                                        img {
                                            border-radius: 500px;
                                            width: 50px;
                                        }
                                    }

                                    &-detail {
                                        flex: 1;

                                        &-top {
                                            padding-bottom: 8px;

                                            &-username {
                                                font-size: 16px;
                                            }
                                        }

                                        &-time {
                                            font-size: 12px;
                                            margin-right: 20px;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                .comment-form-react {
                    display: flex;
                    justify-content: space-between;
                    border-bottom: 1px solid #f2f2f2;
                    padding-bottom: 10px;

                    &-left,
                    &-right {
                        display: flex;
                        align-items: center;
                        color: #333 !important;

                        .comment-form-item-right {
                            margin-left: 16px;
                            color: #333 !important;

                            i {
                                margin-right: 6px;
                            }
                        }

                        .comment-form-item-left {
                            padding: 4px 10px;
                            margin-right: 10px;
                            border: 1px solid #e5e5e5;
                            border-radius: 4px;

                            a {
                                text-decoration: none;
                                color: #000;

                                i {
                                    margin-right: 6px;
                                }
                            }
                        }

                    }
                }
            }
        }
    }
}
</style>
