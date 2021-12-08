<template>
<div :class="'profile-container-content-right-info-song ' + isPlaying">
    <div v-if="index || index === 0" :class="'index-top-song top' + index ">{{index + 1}}</div>
    <div class="profile-container-content-right-info-song-avatar" @click="setCurrentSong">
        <img :src="'/api/v2/public/musics/' + song.id + '/image'" alt="">
    </div>
    <div class="profile-container-content-right-info-song-text"  @click="setCurrentSongAndRedirect">
        <div class="profile-container-content-right-info-song-text-name">{{song.name}}</div>
        <div class="profile-container-content-right-info-song-text-author">{{song.author}}</div>
        <div v-if="type === 'trending'" class="profile-container-content-right-info-song-text-list">
            <div class="profile-container-content-right-info-song-text-list-item">
                <span style="margin-right: 6px;">Today view: </span><span>{{song.today_view_count}}</span>
            </div>
        </div>
         <div v-else class="profile-container-content-right-info-song-text-list">
            <div class="profile-container-content-right-info-song-text-list-item">
                <i class="fas fa-play"></i>{{song.view_count}}
            </div>
            <div class="profile-container-content-right-info-song-text-list-item">
                <i class="fas fa-heart"></i>{{song.like_count}}
            </div>
        </div>
    </div>
    <div v-if="type === 'update-music'" class="album-action" style="display: flex; justify-content: flex-end; flex: 1;">
        <nuxt-link :to="'/update-music/' + song.id" class="album-action-update al-item" style="margin-right: 10px;">
            <div class="modal-box-create-submit">
                Update
            </div>
        </nuxt-link>
        <!-- <div class="album-action-update al-item" style="margin-right: 10px;" @click="deleteMusic(song.id)">
            <div class="modal-box-create-submit">
                Delete
            </div>
        </div> -->
    </div>
</div>
</template>

<script lang="ts">
import {
    Component,
    Prop,
    Mixins
} from 'vue-property-decorator';
import store from '~/controllers';
import ApiClient from '~/library/ApiClient';
import MusicMixin from '~/mixins/music';

@Component
export default class AlbumItem2 extends Mixins(MusicMixin) {
    @Prop() song: any
    @Prop() isPlaying: string
    @Prop() type: string
    @Prop() index: number

    setCurrentSongAndRedirect() {
        this.setCurrentSong()
        this.$router.push("/listen-music-detail")
    }

    setCurrentSong() {
        store.value.currentSong = this.song
        this.addPlaylist()
        localStorage.setItem("currentSong", JSON.stringify(this.song))
    }

    get currentSong() {
        return store.value.currentSong
    }

    addPlaylist() {
        if(this.currentSong === false) {
            store.value.currentSong = this.song
        }
        const playlistStore: any = store.value.playlist
        const indexExistSong = playlistStore.findIndex((song: any) => song.id === this.song.id);
        if (indexExistSong === -1 || playlistStore.length === 0) {
            playlistStore.push(this.song)
        }
    }

    async deleteMusic(id: number) {
        try {
            await new ApiClient().delete(`resource/musics/${id}`)
        } catch (error) {
            return error
        }
        
    }
}
</script>

<style lang="less">
.profile-container-content-right-info-song {
    padding: 7px 14px;
    display: flex;
    width: 100%;
    cursor: pointer;

    .index-top-song {
        display: flex;
        align-items: center;
        font-size: 20px;
        font-weight: 500;
        color: #7a7a7a;
        min-width: 26px;
        justify-content: space-between;
    }

    .top0 {
        color: #e74c3c;
    }

    .top1 {
        color: #1abc9c
    }

    .top2 {
        color: #f39c12;
    }

    &-avatar {
        padding: 0 10px;
        display: flex;
        align-items: center;
        img {
            width: 56px;
            height: 56px;
            object-fit: cover;
        }
    }

    &-text {
        color: #999;

        &-name {
            font-size: 14px;
            white-space: nowrap;
            overflow: hidden;
            max-width: 200px;
            text-overflow: ellipsis;
        }

        &-author {
            color: #999;
            font-size: 12px;
            line-height: 16px;
        }

        &-list {
            display: flex;
            padding-top: 6px;

            &-item {
                margin-right: 14px;
                font-size: 14px;
                display: flex;
                align-items: center;

                i {
                    margin-right: 6px;
                    zoom: 0.8;
                }
            }
        }
    }
}

.profile-container-content-right-info-song:hover {
    background-color: rgba(76, 182, 203, 0.3)
}

.item-title-top,
.item-title-bot {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #545a5f;
    font-size: 15px;
    line-height: 19px;
    max-width: 140px;
}
.item-title-bot {
    color: #939aa0;
    font-size: 12px;
}
</style>
