<template>
<div class="container" style="padding-top: 1px; padding-bottom: 95px;">
    <div class="container-listen">
        <div class="container-listen-content">
            <div class="container-listen-content-left">
                <div class="comment-form">
                    <CmtForm @submit.prevent="comment">
                        <div v-if="getUser" class="comment-form-avatar">
                            <img :src="'api/v2/public/users/' + getUser.uid + '/avatar'" alt="">
                        </div>
                        <div v-else class="comment-form-avatar">
                            <img src="/Placeholder.jpg" alt="">
                        </div>
                        <div class="comment-form-detail">
                            <CmtInput v-model="contentCmt" :required="true" />
                        </div>
                    </CmtForm>
                </div>
                <div class="comment-form-react">
                    <div class="comment-form-react-left">
                        <div class="comment-form-item-left" style="height: 30px; width: 30px; border-radius: 50%;">
                            <div :class="'stage ' + getSetLikedState" @click="setLikedState">
                                <div class="heart" style="zoom: 0.6;"></div>
                            </div>
                        </div>
                        <div class="comment-form-item-left">
                            <i class="fas fa-plus"></i>Add to next up
                        </div>
                        <div class="comment-form-item-left" @click="showModal">
                            <i class="fas fa-plus"></i>Add to album
                        </div>
                        <modal-box ref="modal" />
                    </div>
                    <div class="comment-form-react-right">
                        <div class="comment-form-item-right">
                            <i class="fas fa-play" style="color: #4cb6cb;"></i>{{currentSong.view_count}}
                        </div>
                        <div class="comment-form-item-right">
                            <i class="fas fa-heart" style="color: #e2264d;"></i>{{likeCountCurrentSong}}
                        </div>
                    </div>
                </div>
                <div class="comment-detail">
                    <div class="comment-detail-right">
                        <div class="comment">
                            <div class="comment-count">
                                <i class="fas fa-comment-alt"></i>{{comments.length}} comments
                            </div>
                            <div v-if="comments.length === 0">
                                <div style="text-align: center; margin: 100px 0;">
                                    <div style="zoom: 10;">
                                        <i class="fas fa-comment-alt" style="color: #d1cdcd;"></i>
                                    </div>
                                    <span>Have any other comment</span>
                                </div>
                            </div>
                            <div v-else>
                                <div v-for="(item, index) in comments" :key="index" class="comment-list">
                                    <div class="comment-list-item">
                                        <comment :commentItem="item" :type="'main'" :indexCmt="index" :showReplyCmt="showReplyCmt" />
                                        <div v-for="(replyItem, index2) in item['replies']" :key="index2">
                                            <comment :commentItem="replyItem" :type="'reply'" :indexCmt="index" :showReplyCmt="showReplyCmt" />
                                        </div>
                                        <CmtForm :type="'reply'" :indexCmt="index" :indexReply="replyCmt" @submit.prevent="replyComment(item.id)">
                                            <div v-if="getUser" class="comment-form-avatar">
                                                <img :src="'api/v2/public/users/' + getUser.uid + '/avatar'" alt="">
                                            </div>
                                            <div v-else class="comment-form-avatar">
                                                <img src="/Placeholder.jpg" alt="">
                                            </div>
                                            <div class="comment-form-detail reply-comment">
                                                <CmtInput v-model="contentReply" :required="true" />
                                            </div>
                                        </CmtForm>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="container-listen-content-right">
                <div class="container-listen-content-right-title">
                    <i class="fas fa-forward"></i> Next song
                </div>
                <div v-for="(song, index) in playlist" :key="index">
                    <SongItem2 v-if="song.id === currentSong.id" :song="song" class="hover" />
                    <SongItem2 v-else :song="song" />
                </div>
                <div class="container-listen-content-right-title" style="margin-left: 20px;">
                    Other music
                </div>
                <div v-for="(song, index) in recommendMusic" :key="index">
                    <SongItem2 v-if="song.id === currentSong.id" :song="song" class="hover" />
                    <SongItem2 v-else :song="song" />
                </div>
            </div>

        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    mixins,
    Component,
    Ref
} from 'nuxt-property-decorator';
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ListSong2 from '../components/Song2/ListSong2.vue'
import Comment from '../components/Comment.vue'
import ModalBox from "@/components/Modal-box.vue"
import store from '~/controllers'
import MusicMixin from '~/mixins/music'

@Component({
    middleware: ["requirePlayList", "album"],
    components: {
        Header,
        Footer,
        ListSong2,
        ModalBox,
        Comment
    },
})

export default class Listen_music_detail extends mixins(MusicMixin) {
    @Ref("modal") modalBox: ModalBox;
    isLike: string = this.likedCurrentSong ? "is-active" : ""
    isShowModal: boolean = false
    user: any = store.value.user
    replyCmt: any = null
    preSong = store.value.currentSong

    layout() {
        return 'music'
    }

    get currentSong(): any {
        return store.value.currentSong
    }

    get getUser() {
        return store.value.user
    }

    get likedCurrentSong() {
        return this.currentSong.liked
    }

    get likeCountCurrentSong() {
        return this.currentSong.like_count
    }

    get playlist() {
        return store.value.playlist
    }

    get allMusics() {
        return store.value.music
    }

    showModal() {
        if (!store.value.user) {
            return this.$router.push('/login')
        }
        // this.isShowModal = !this.isShowModal
        this.modalBox.create2("");
    }

    async mounted() {
        const that = this

        store.value.isMusicDetail = "position: relative; top: 0px;"

        if (process.client) {
            if (!store.value.currentSong && localStorage.getItem("currentSong")) {
                const songLocal: any = localStorage.getItem("currentSong")
                store.value.currentSong = JSON.parse(songLocal);
                store.value.playlist = [store.value.currentSong]
            }
        }

        await this.getAllComment()

        setInterval(() => {
            if (that.currentSong !== that.preSong) {
                that.preSong = that.currentSong
                this.getAllComment()
            }
        }, 100)
    }

    showReplyCmt(indexCmt: number) {
        this.replyCmt = indexCmt
    }

    setLikedState() {
        if (this.isLike === "") {
            this.isLike = "is-active"
            this.like(this.currentSong.id)
        } else {
            this.isLike = ""
            this.unLike(this.currentSong.id)
        }
    }

    get getSetLikedState() {
        return this.isLike
    }

    get recommendMusic() {
        const trending = store.value.trending
        const limitMusic = trending?.slice(0, 5)
        return limitMusic
    }

}
</script>

<style lang="less">
.stage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .heart {
        width: 100px;
        height: 100px;
        background: url("https://cssanimation.rocks/images/posts/steps/heart.png") no-repeat;
        background-position: 0 0;
        cursor: pointer;
        transition: background-position 1s steps(28);
        transition-duration: 0s;

    }
}

.is-active {
    .heart {
        background-position: -2800px 0;
        transition-duration: 1s;
    }
}

.close-modal {
    position: absolute;
    top: 20px;
    right: 24px;
}

.container {
    background-color: #f2f4f8;
    display: flex;
    justify-content: center;
    flex-direction: row;

    .container-listen {
        width: 1200px;
        background-color: #fff;

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
                    margin: 14px 0;

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
                    display: flex;
                    height: 50px;
                    margin-bottom: 16px;
                    border-radius: 4px;
                    width: 100%;

                    &-avatar {
                        img {
                            width: 30px;
                            height: 30px;
                            object-fit: cover;
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
                            padding-left: 60px;

                            &-count {
                                margin-bottom: 20px;

                                i {
                                    margin-right: 10px;
                                }
                            }

                            &-list {
                                &-item {
                                    display: flex;
                                    flex-direction: column;
                                    padding: 1px;

                                    &-main,
                                    &-reply {
                                        display: flex;
                                        padding: 5px 0;

                                        .comment-list-item-avatar {
                                            margin-right: 10px;

                                            img {
                                                border-radius: 500px;
                                                width: 40px;
                                                height: 40px;
                                                object-fit: cover;
                                            }
                                        }

                                        .comment-list-item-detail {
                                            flex: 1;

                                            &-top {
                                                padding-bottom: 1px;

                                                &-username {
                                                    font-size: 16px;
                                                    color: rgb(22, 24, 35);
                                                    font-weight: 500;
                                                }
                                            }

                                            &-center {
                                                font-size: 16px;
                                                line-height: 22px;
                                                color: rgb(18, 18, 18);
                                                padding-right: 30px;
                                            }

                                            &-bot {
                                                display: flex;
                                                margin-top: 6px;

                                                &-time {
                                                    font-size: 14px;
                                                }

                                                &-reply {
                                                    margin-left: 24px;
                                                    font-size: 15px;
                                                    cursor: pointer;
                                                }
                                            }

                                            &-react {
                                                font-size: 12px;
                                                min-width: 20px;
                                                text-align: center;

                                                &-number {
                                                    padding-bottom: 20px;
                                                    margin-top: -18px;
                                                }
                                            }
                                        }

                                    }

                                    &-reply {
                                        padding-left: 50px;

                                        .comment-list-item-avatar {
                                            margin-right: 10px;

                                            img {
                                                border-radius: 500px;
                                                width: 30px;
                                                height: 30px;
                                                object-fit: cover;
                                            }
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
                            position: relative;
                            padding: 4px 10px;
                            margin-right: 10px;
                            border: 1px solid #e5e5e5;
                            border-radius: 4px;
                            cursor: pointer;

                            i {
                                margin-right: 6px;
                                color: #4cb6cb;
                            }
                        }

                        .comment-form-item-left:hover {
                            background-color: #4cb6cb;
                            color: #fff;

                            i {
                                color: #fff;
                            }
                        }

                    }
                }
            }

        }
    }
}
</style>
