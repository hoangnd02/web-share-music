<template>
<div>
    <div class="new-song-list-item-avatar">
        <div class="overlay">
            <div class="overlay-play">
                <div v-if="isPlaying && album === currentAlbum" @click="setPlayPause">
                    <i class="far fa-pause-circle" style="color: #fff;"></i>
                </div>
                <div v-else >
                    <i v-if="album === currentAlbum" class="fa fa-play-circle" style="color: #fff;" @click="setCurrentAlbum"></i>
                    <i v-else class="fa fa-play-circle" @click="setCurrentAlbum"></i>
                </div>
            </div>
        </div>
        <div @click="setCurrentAlbum">
            <img :src="'/api/v2/public/albums/' + album.id + '/image'" alt="" />
        </div>
    </div>
    <div style="padding: 10px 0;" @click="setCurrentAlbum">
        <div class="new-song-list-item-title" style="padding: 1px;">
            <div class="item-title-top">{{album.name}}</div>
            <div class="item-title-bot">{{author}}</div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import { Context } from 'vm';
import {
    Component,
    Prop,
    Mixins
} from 'vue-property-decorator';
import store from '~/controllers';
import ApiClient from '~/library/ApiClient';
import MusicMixin from '~/mixins/music';

@Component
export default class AlbumItem4 extends Mixins(MusicMixin) {
    @Prop() album: any
    author: string = ""

    get isLoading() {
        return store.value.isLoading
    }

    get isPlaying() {
        return store.value.isPlaying
    }

    get currentAlbum() {
        return store.value.currentAlbum
    }

    get wavesuffer(): any {
        return store.value.wavesurfer
    }

    setCurrentAlbum() {
        if(this.currentAlbum !== this.album) {
            store.value.currentAlbum = this.album
        }
        this.$router.push('/album-detail')
    }

    setPlayPause() {
        store.value.isPlaying = !store.value.isPlaying
        this.wavesuffer.playPause()
    }

    async asyncData({$axios}: Context) {
        const authorCreateAlbum: any = await new ApiClient($axios).get(`public/users/${store.value.user?.uid}`)
        return {
            author: authorCreateAlbum
        }
    }
}
</script>

<style lang="css">
.container-new-top {
    display: block;
}

.new-song {
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

/* .overlay {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2;
    align-items: center;
    justify-content: center;
    display: none;
} */

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
}

.overlay i {
    z-index: 3;
    color: #ccc;
    zoom: 2.4;
    text-shadow: 0 0 3px #000;
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
