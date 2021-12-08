<template>
<div>
    <div class="new-song-list-item-avatar">
        <div class="overlay" :style="song.id === currentSong.id && 'display: flex;'">
            <div class="overlay-play">
                <div v-if="isLoading && song === currentSong" class="loading">
                    <img src="https://c.tenor.com/I6kN-6X7nhAAAAAj/loading-buffering.gif" style="width: 50px; height: 50px; justify-content: center;" />
                </div>
                <div v-else-if="isPlaying && song.id === currentSong.id" @click="setPlayPause">
                    <i class="far fa-pause-circle" style="color: #dbdbdb;"></i>
                </div>
                <div v-else>
                    <i v-if="song.id === currentSong.id" class="fa fa-play-circle" style="color: #dbdbdb;" @click="setPlayPause"></i>
                    <i v-else class="fa fa-play-circle" @click="setCurrentSong()"></i>
                </div>
            </div>
            <div class="overlay2">
            </div>
            <div class="overlay-bot">
                <div class="overlay-bot-left" @click="addPlaylist">
                    <i v-if="!isMusicInPlaylist" class="fa fa-plus-circle"></i>
                    <i v-else class="fa fa-check-circle" style="color: #25cd66;"></i>
                </div>
                <div class="overlay-bot-right">
                    <div :class="'stage ' + getSetLikedState" style="left: 90%;" @click="setLikedState">
                        <div class="heart" style="zoom: 0.6;"></div>
                    </div>
                </div>
            </div>
        </div>
        <nuxt-link to="/listen-music-detail">
            <img :src="'/api/v2/public/musics/' + song.id + '/image'" alt="" />
        </nuxt-link>
    </div>
    <div style="padding: 10px 0;" @click="setCurrentSong()">
        <nuxt-link to="/listen-music-detail" class="new-song-list-item-title">
            <div class="item-title-top">{{song.name}}</div>
            <div class="item-title-bot">{{song.author}}</div>
        </nuxt-link>
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
import MusicMixin from '~/mixins/music';

@Component
export default class AlbumItem extends Mixins(MusicMixin) {
    @Prop() song: any
    isLiked: string = this.getLikedSong ? "is-active" : ""

    get getSong() {
        return this.song
    }

    get getLikedSong() {
        return this.song.liked
    }

    get isLoading() {
        return store.value.isLoading
    }

    get isPlaying() {
        return store.value.isPlaying
    }

    get currentSong() {
        return store.value.currentSong
    }

    get wavesuffer(): any {
        return store.value.wavesurfer
    }

    get isMusicInPlaylist() {
        if (store.value.playlist.length > 0) {
            const index = store.value.playlist.findIndex((music: any) => music.id === this.song.id)
            return index !== -1
        }
        return false
    }

    setCurrentSong() {
        this.addPlaylist()
        store.value.currentSong = this.song
        store.value.isPlaying = !store.value.isPlaying
        localStorage.setItem("currentSong", JSON.stringify(this.song))
    }

    setPlayPause() {
        store.value.isPlaying = !store.value.isPlaying
        this.wavesuffer.playPause()
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

    setLikedState() {
        if(this.isLiked === "") {
            this.isLiked = "is-active"
            this.like(this.getSong.id)
        } else {
            this.isLiked = ""
            this.unLike(this.getSong.id)
        }
    }

    get getSetLikedState() {
        return this.isLiked
    }
}
</script>

<style lang="css">
.container-new-top {
    /* display: flex; */
    display: block;
}

.new-song {
    /* width: 58.33333333%; */
    width: 100%;
}

.new-song-list-item {
    /* padding: 0 10px; */
    padding: 0 5px;
    overflow: hidden;
}

.new-song-list-item-avatar {
    position: relative;
}

.new-song-list-item-avatar img {
    width: 163px;
    height: 163px;
    object-fit: cover;
    border-radius: 4px;
    display: block;
    z-index: 1;
}

.new-song-list-item-title {
    padding: 10px 0;
    width: 140px;
}

.top-song-list-item {
    padding: 15px;
    background-color: #fff;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
}

.top-song-list-item-title {
    margin-left: 14px;
    max-width: 140px;
}

.top-song-list-item-left {
    display: flex;
    align-items: center;
}

.top-song-list-item-right {
    color: #939aa0;
    display: flex;
    align-items: center;
    font-size: 30px;
}

.top-song-list-item-avatar img {
    border-radius: 500px;
    width: 40px;
}

.new-song-list {
    margin: 0 -5px;
}

.top-song-list {
    margin-right: -10px;
}

.overlay2 {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 0;
    border-radius: 6px;
}

.overlay {
    align-items: center;
    justify-content: center;
    display: none;
}

.overlay-play {
    position: absolute;
    top: 0;
    display: flex;
    align-items: center;
    height: 100%;
    z-index: 2;
}

.overlay i {
    z-index: 3;
    color: #999;
    zoom: 2.4;
    text-shadow: 0 0 3px #606060;
}

.overlay i:hover {
    color: #ffff;
    z-index: 5;
}

.new-song-list-item:hover .overlay {
    display: flex;
}

.overlay-bot {
    position: absolute;
    bottom: 0;
    display: flex;
    justify-content: space-between;
    padding: 4px 8px;
    width: 100%;
}

.overlay .overlay-bot-left i,
.overlay .overlay-bot-right i {
    zoom: 1;
}
</style>
