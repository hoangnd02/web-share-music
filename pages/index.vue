<template>
<div>
    <div class="container" style="display: flex;">
        <div class="container-new-top">
            <div class="new-song">
                <div class="container-title">
                    <h2 class="container-title-left">Top Songs
                        <span class="musicbar" style="width: 20px; height: 20px">
                            <span class="bar1 a1 bg-primary lter"></span>
                            <span class="bar2 a2 bg-info lt"></span>
                            <span class="bar3 a3 bg-success"></span>
                            <span class="bar4 a4 bg-warning dk"></span>
                            <span class="bar5 a5 bg-danger dker"></span>
                        </span>
                    </h2>
                </div>
                <list-album :listSong="newMusics" />
            </div>
            <div class="top-song">
                <div class="container-title">
                    <h2 class="container-title-left">Top Albums
                        <span class="musicbar" style="width: 20px; height: 20px">
                            <span class="bar1 a1 bg-primary lter"></span>
                            <span class="bar2 a2 bg-info lt"></span>
                            <span class="bar3 a3 bg-success"></span>
                            <span class="bar4 a4 bg-warning dk"></span>
                            <span class="bar5 a5 bg-danger dker"></span>
                        </span>
                    </h2>
                </div>
                <list-album4 :listSong="allAlbums" />
            </div>
            <div class="top-song">
                <div class="container-title">
                    <h2 class="container-title-left">All Songs
                        <span class="musicbar" style="width: 20px; height: 20px">
                            <span class="bar1 a1 bg-primary lter"></span>
                            <span class="bar2 a2 bg-info lt"></span>
                            <span class="bar3 a3 bg-success"></span>
                            <span class="bar4 a4 bg-warning dk"></span>
                            <span class="bar5 a5 bg-danger dker"></span>
                        </span>
                    </h2>
                </div>
                <list-album :listSong="getStoreMusics" />
            </div>

        </div>
        <div class="container-trending">
            <div class="new-song">
                <div class="container-title" style="padding-left: 10px;">
                    <h2 class="container-title-left">Top Daily Trending
                        <span class="musicbar" style="width: 20px; height: 20px">
                            <span class="bar1 a1 bg-primary lter"></span>
                            <span class="bar2 a2 bg-info lt"></span>
                            <span class="bar3 a3 bg-success"></span>
                            <span class="bar4 a4 bg-warning dk"></span>
                            <span class="bar5 a5 bg-danger dker"></span>
                        </span>
                    </h2>
                </div>
                <div v-for="(songItem, index) in trendingMusics" :key="index">
                    <SongItem2 :song="songItem" :index="index" :type="'trending'" />
                </div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    Component,
    mixins,
} from 'nuxt-property-decorator'
import Header from '../components/Header.vue'
import Footer from '../components/Footer.vue'
import ListAlbum from '../components/Album/ListAlbum.vue'
import ListAlbum4 from '../components/Album4/ListAlbum4.vue'
import ListSong2 from '../components/Song2/ListSong2.vue'
import store from '~/controllers/store'
import MusicMixin from '~/mixins/music'

@Component({
    components: {
        Header,
        ListAlbum,
        ListAlbum4,
        ListSong2,
        Footer
    },
})

export default class Index extends mixins(MusicMixin) {
    listMusic: any = this.getStoreMusics

    get getStoreMusics() {
        return store.value.music
    }

    get trendingMusics() {
        return store.value.trending
    }

    get newMusics() {
        return store.value.newSongs
    }

    get allAlbums() {
        return store.value.albums
    }

    layout() {
        return 'music'
    }

    head() {
        return {
            title: 'Trang chủ',
        }
    }

    mounted() {
        store.value.isMusicDetail = "position: absolute; top: -500px;"
    }
}
</script>

<style lang="less" scoped>
.container {
    padding: 0 30px;
    background-color: #f2f4f8;
    padding-bottom: 64px;
}

.container-listen-main {
    display: none !important;
}

.container-new-top {
    width: 70%;
}

.container-trending {
    padding-left: 30px;
    flex: 1;
    max-width: 400px;
}

.container-title {
    display: flex;
    justify-content: space-between;
    position: relative;
}

.container-title-left {
    font-weight: 300;
    font-size: 24px;
    color: #788188;
    display: block;
    margin: 20px 0 15px 0;

}

.container-title-right {
    color: #939aa0;
    display: flex;
    align-items: center;
    text-decoration: none;
}

.container-title-right i {
    zoom: 1.2;
}

h2 {
    font-family: inherit;
}

.active1 {
    background-color: #62bcce;
}
</style>
