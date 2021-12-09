<template>
<footer class="footer">
    <div class="footer-control">
        <div class="footer-control-item">
            <div class="jp-previous" @click="pre_song">
                <i class="fas fa-backward"></i>
            </div>
        </div>
        <div class="footer-control-item">
            <a class="jp-play" style="display: inline-block">
                <div v-if="isLoading" style="color: #999">
                    <i class="fas fa-play"></i>
                </div>
                <div v-else>
                    <div v-if="isPlaying" @click='play'>
                        <i class="fas fa-pause"></i>
                    </div>
                    <div v-else @click='play'>
                        <i class="fas fa-play"></i>
                    </div>
                </div>
            </a>
        </div>
        <div class="footer-control-item">
            <div class="jp-next" @click="next_song">
                <i class="fas fa-forward"></i>
            </div>
        </div>
        <div :class="'footer-control-item'  + ' ' + [isPlaylist]">
            <div class="playlist-icon">
                <i class="fas fa-list" @click="showPlaylist"></i>
            </div>
            <div class="playlist">
                <div class="playlist-title">
                    <div>
                        Next up
                    </div>
                    <!-- <div>
                        <i class="fas fa-times" @click="showPlaylist"></i>
                    </div> -->
                </div>
                <div v-for="(item) in playList" :key="item.id" class="playlist-list">
                    <div :class="'playlist-list-item' + ' ' + [currentSong.id === item.id ? 'active' : '']" >
                        <div class="profile-container-content-right-info-song">
                            <div class="profile-container-content-right-info-song-close" @click="deletePlaylistSong(item.id)">
                                <i class="fas fa-times"></i>
                            </div>
                            <div class="profile-container-content-right-info-song-avatar" @click="setCurrentTrack(item)">
                                <img v-if="currentSong" :src="'/api/v2/public/musics/' + item.id + '/image'" alt="" />
                            </div>
                            <div class="profile-container-content-right-info-song-text">
                                <div class="profile-container-content-right-info-song-text-name">
                                    {{item.name}}
                                </div>
                                <div class="profile-container-content-right-info-song-text-author">
                                    {{item.author}}
                                </div>
                                <div class="profile-container-content-right-info-song-text-list">
                                    <div class="profile-container-content-right-info-song-text-list-item">
                                        <i class="fas fa-play"></i>{{item.view_count}}
                                    </div>
                                    <div class="profile-container-content-right-info-song-text-list-item">
                                        <i class="fas fa-heart"></i>{{item.like_count}}
                                    </div>
                                    <div class="profile-container-content-right-info-song-text-list-item">
                                        <i class="fas fa-comment-alt"></i>0
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- <SongItem2 :song="item" /> -->
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="footer-progress">
        <div class="footer-progress-start">
            <span>{{(convertSecondToMinute(data2.currentTime/60))}}</span>:<span>{{convertSecondToMinute(data2.currentTime%60)}}</span>
        </div>
        <div class="footer-progress-timeLine">
            <input id="hoang" v-model="data2.progressTimeLine" class="footer-progress-timeLine-detail" type="range" min='0' max="100" step="1" @input="progress" />
        </div>
        <div class="footer-progress-end">
            <span>{{(convertSecondToMinute(data2.totalTime/60))}}</span>:<span>{{convertSecondToMinute(data2.totalTime%60)}}</span>
        </div>
    </div>
    <div class="footer-end">
        <div class="footer-end-button-song" style="min-width: 250px;">
            <SongItem2 :song="currentSong" />
        </div>
        <div class="footer-end-button">
            <div class="footer-end-button-volume" @click="mute">
                <div v-if="muted" class='footer-end-button-volume-icon'>
                    <i class="fas fa-volume-up"></i>
                </div>
                <div v-else class='footer-end-button-volume-icon'>
                    <i class="fas fa-volume-mute" style="color: #ccc"></i>
                </div>
                <!-- <div class="footer-volume-value">
                </div> -->
            </div>
            <div class="footer-end-button-shuffle">
                <div v-if="isShuffle" class="active" @click="shuffle">
                    <i class="fas fa-random"></i>
                </div>
                <div v-else @click="shuffle">
                    <i class="fas fa-random"></i>
                </div>
            </div>
            <div class="footer-end-button-replay">
                <div v-if="isReplay" class="active" @click="rePlay">
                    <i class="fas fa-undo"></i>
                </div>
                <div v-else @click="rePlay">
                    <i class="fas fa-undo"></i>
                </div>
            </div>
        </div>
    </div>
</footer>
</template>

<script lang="ts">
import {
    Vue,
    Component,
} from 'vue-property-decorator';
import SongItem2 from './Song2/SongItem2.vue';
import ListSong2 from './Song2/ListSong2.vue';
import store from '~/controllers';

@Component({
    middleware: "getLocalMusic",
    components: {
        SongItem2,
        ListSong2
    }
})
export default class Footer extends Vue {
    data2 = {
        currentTime: 0,
        totalTime: 0,
        isLoading: true,
        progressTimeLine: 0,
        currentTrack: this.currentSong
    }

    get isPlaying() {
        return store.value.isPlaying
    }

    get playList() {
        return store.value.playlist
    }

    get isLoading() {
        return this.data2.isLoading
    }

    get currentSong(): any {
        return store.value.currentSong
    }

    WaveSurfer: any
    waveSurfer: any
    isPlay: boolean = false
    muted: boolean = true
    isReplay: boolean = false
    isShuffle: boolean = false
    isPlaylist: string = ''
    preSong = store.value.currentSong


    mounted() {
        if (process.server) return;

        if (process.browser) {
            this.WaveSurfer = require('wavesurfer.js');
        }

        this.createWaveSuffer()
        this.loadNextSong()
        const that = this
        setInterval(() => {
            if (that.currentSong !== that.preSong) {
                that.loadNextSong()
                that.preSong = that.currentSong
            }
            if(store.value.destroyWavesuffer) {
                that.waveSurfer.destroy()
                store.value.destroyWavesuffer = false
            }
        }, 100)
    }

    setCurrentTrack(nextSong: any) {
        store.value.currentSong = nextSong
        this.loadNextSong()
    }

    progress() {
        this.waveSurfer.seekAndCenter(this.data2.progressTimeLine / 100)
    }

    createWaveSuffer() {
        this.waveSurfer = this.WaveSurfer.create({
            container: '#hoang',
            waveColor: "#eee",
            progressColor: "#4cb6cb",
            cursorColor: "#4cb6cb",
            cursorWidth: 0,
            barWidth: 4,
            barRadius: 3,
            hideCursor: true,
        });
        store.value.wavesurfer = this.waveSurfer
    }

    play() {
        this.isPlay = !this.isPlay
        store.value.isPlaying = this.isPlay
        this.waveSurfer.playPause()
    }

    rePlay() {
        this.isReplay = !this.isReplay
    }

    shuffle() {
        this.isShuffle = !this.isShuffle
    }

    pre_song() {
        if (store.value.playlist.length === 0) {
            return this.loadNextSong();
        }
        if (store.value.indexPlaylist === 0) {
            store.value.indexPlaylist = store.value.playlist.length - 1
        } else {
            store.value.indexPlaylist = store.value.indexPlaylist - 1
        }
        store.value.currentSong = store.value.playlist[store.value.indexPlaylist]
        this.loadNextSong();
    }

    next_song() {
        if(this.isShuffle) {
            const musicStore: any = store.value.music
            const randomMusicIndex = Math.floor(Math.random() * ((musicStore.length -1) - 0 + 1)) + 0;
            store.value.currentSong = musicStore[randomMusicIndex]
            return 
        }
        if (store.value.playlist.length === 0) {
            return this.loadNextSong();
        }
        if (store.value.indexPlaylist === store.value.playlist.length - 1) {
            store.value.indexPlaylist = 0
        } else {
            store.value.indexPlaylist = store.value.indexPlaylist + 1
        }
        store.value.currentSong = store.value.playlist[store.value.indexPlaylist]
        this.loadNextSong();
    }

    mute() {
        this.waveSurfer.setMute(this.muted)
        this.muted = !this.muted;
    }

    showPlaylist() {
        this.isPlaylist = this.isPlaylist === 'active' ? "" : "active"
    }

    convertSecondToMinute(time: number) {
        const second = Math.round(time)
        return second < 10 ? `0${second}` : second
    }

    deletePlaylistSong(songId: any) {
        const playListMusic = store.value.playlist
        const findIndexSong = playListMusic.findIndex((song: any) => song.id === songId);
        playListMusic.splice(findIndexSong, 1)
        store.value.playlist = playListMusic
    }

    loadNextSong() {
        if (process.server) return;

        const that = this
        this.waveSurfer.destroy()

        this.createWaveSuffer()

        const wave = this.waveSurfer

        if(this.currentSong) {
            this.waveSurfer.load("/api/v2/public/musics/" + this.currentSong.id + "/audio");
        }

        that.data2.currentTime = 0
        that.data2.progressTimeLine = 0

        wave.on("loading", function () {
            that.data2.isLoading = true
            store.value.isLoading = true
        })

        wave.on('ready', function () {
            that.data2.totalTime = wave.getDuration()
            that.data2.isLoading = false
            store.value.isLoading = false

            that.isPlay = true
            store.value.isPlaying = that.isPlay

            wave.play();
        });

        wave.on('audioprocess', function () {
            if (wave.isPlaying()) {
                that.data2.currentTime = wave.getCurrentTime()
                that.data2.progressTimeLine = that.data2.currentTime / that.data2.totalTime * 100
            }
        });

        this.finishSong()
    }

    finishSong() {
        const that = this
        this.waveSurfer.on('finish', () => {
            if(that.isShuffle) {
                const musicStore: any = store.value.music
                const randomMusicIndex = Math.floor(Math.random() * ((musicStore.length -1) - 0 + 1)) + 0;
                store.value.currentSong = musicStore[randomMusicIndex]
                return 
            }
            if (store.value.playlist.length <= 1) {
                return this.loadNextSong();
            }
            if (that.isReplay) {
                this.loadNextSong();
            } else {
                if (store.value.indexPlaylist === store.value.playlist.length -1) {
                    store.value.indexPlaylist = 0
                    // that.deletePlaylistSong(that.currentSong.id)
                } else {
                    // that.deletePlaylistSong(that.currentSong.id)
                    store.value.indexPlaylist = store.value.indexPlaylist + 1
                }
                store.value.currentSong = store.value.playlist[store.value.indexPlaylist]
                this.loadNextSong();
            }
        });
    }
}
</script>

<style lang="less">
.footer {
    display: flex;
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    z-index: 999;

    &-avatar {
        background-color: #000;
        padding: 10px;

        img {
            width: 40px;
            border-radius: 500px;
        }
    }

    &-control {
        color: #fff;
        display: flex;
        align-items: center;
        background-color: #5a6a7a;
        justify-content: space-between;

        &-item {
            width: 60px;
            display: flex;
            justify-content: center;

            i {
                color: #fff;
                zoom: 1.1;
            }

            .playlist {
                box-shadow: 1px 1px 4px 3px rgba(0, 0, 0, .1);
                background-color: #fff;
                width: 400px;
                position: absolute;
                bottom: 80px;
                left: 200px;
                transform: translateY(20px);
                transition-duration: 0.35s;
                opacity: 0;
                display: none;
                cursor: pointer;

                &-title {
                    padding: 20px 10px;
                    color: #000;
                    display: flex;
                    justify-content: space-between;

                    i {
                        color: #999;
                        zoom: 1.1;
                    }
                }

                &-list {
                    &-item {
                        .profile-container-content-right-info-song {
                            padding: 10px 0;
                            display: flex;
                            position: relative;

                            &-close {
                                position: absolute;
                                top: 0;
                                right: 0;
                                padding: 8px 12px;
                                display: none;

                                i {
                                    color: #999;
                                    zoom: 0.9;
                                }
                            }

                            &-avatar {
                                padding: 0 10px;
                            }

                            &-text {
                                color: #999;

                                &-name {
                                    font-size: 14px;
                                }

                                &-author {
                                    color: #999;
                                    font-size: 12px;
                                }

                                &-list {
                                    display: flex;
                                    justify-content: space-between;
                                    padding: 4px 0;
                                    margin-left: -2px;

                                    &-item {
                                        margin-right: 20px;
                                        font-size: 14px;

                                        i {
                                            margin-right: 6px;
                                            zoom: 0.8;
                                            color: #ccc;
                                        }
                                    }
                                }
                            }
                        }
                    }

                    &-item:hover {
                        background-color: #f8f8f8;
                         .profile-container-content-right-info-song {
                            &-close {
                               display: block;
                            }
                        }
                    }
                }
            }

            .fa-play {
                zoom: 1.4;
            }

            .active {
                background-color: rgba(76, 182, 203, 0.5) !important;
                color: #fff !important;
            }
        }

        .active {
            .playlist-icon {
                i {
                    color: #4cb6cb !important;
                    zoom: 1.1;
                }
            }

            .playlist {
                transform: translateY(1px) !important;
                opacity: 1 !important;
                transition-duration: 0.35s !important;
                display: block !important;
            }
        }

    }

    &-progress {
        flex: 1;
        background-color: #4d5d6e;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 30px;

        &-start,
        &-end {
            font-size: 14px;
        }

        &-timeLine {
            height: 20px;
            border-radius: 20px;
            overflow: hidden;
            position: relative;
            margin: 0 20px;
            align-items: center;
            display: flex;
            flex: 1;

            &-detail {
                color: #4cb6cb;
                width: 100%;
                height: 2px;
            }
        }
    }

    &-end {
        // background-color: #5a6a7a;
        background-color: #415263;
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 450px;
        color: #fff;

        &-button {
            display: flex;
            justify-content: space-evenly;
            flex: 1;

            &-volume {
                display: flex;
                align-items: center;

                &-icon {
                    min-width: 20px;
                }

                &-value {
                    width: 40px;
                    background-color: #fff;
                    height: 3px;
                    margin-left: 8px;
                }

            }

            &-replay,
            &-shuffle {
                .active {
                    color: #4cb6cb !important;
                }
            }
        }
    }
}
</style>
