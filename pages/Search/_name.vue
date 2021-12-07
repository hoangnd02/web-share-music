<template>
    <div>
    <div class="container" style="display: flex;">
        <div class="container-new-top">
             <div class="new-song">
                <div class="container-title">
                    <h2 class="container-title-left">Search: {{name}}</h2>
                </div>
            </div>
            <div class="new-song">
                <div class="container-title">
                    <h2 class="container-title-left">Musics
                        <span class="musicbar" style="width: 20px; height: 20px">
                            <span class="bar1 a1 bg-primary lter"></span>
                            <span class="bar2 a2 bg-info lt"></span>
                            <span class="bar3 a3 bg-success"></span>
                            <span class="bar4 a4 bg-warning dk"></span>
                            <span class="bar5 a5 bg-danger dker"></span>
                        </span>
                    </h2>
                </div>
                <list-album :listSong="musicsSearch" />
            </div>
            <div class="top-song">
                <div class="container-title">
                    <h2 class="container-title-left">Albums
                        <span class="musicbar" style="width: 20px; height: 20px">
                            <span class="bar1 a1 bg-primary lter"></span>
                            <span class="bar2 a2 bg-info lt"></span>
                            <span class="bar3 a3 bg-success"></span>
                            <span class="bar4 a4 bg-warning dk"></span>
                            <span class="bar5 a5 bg-danger dker"></span>
                        </span>
                    </h2>
                </div>
                <list-album4 :listSong="albumsSearch" />
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    Component,
    Vue
} from 'nuxt-property-decorator'
import { Context } from '@nuxt/types'
import ListAlbum from '../../components/Album/ListAlbum.vue'
import ListAlbum4 from '../../components/Album4/ListAlbum4.vue'
import ListSong2 from '../../components/Song2/ListSong2.vue'
import ApiClient from "@/library/ApiClient"

@Component({
    middleware: "music",
    components: {
        ListAlbum,
        ListAlbum4,
        ListSong2,
    },
})
export default class Name_Search extends Vue {
    musicsSearch: any[] = []
    albumsSearch: any[] = []
    name: any = ""

    layout() {
        return 'music'
    }

    async watchQuery(newQuery: any, oldQuery: any) {
        if(newQuery.name === oldQuery.name) return
        const {data} = await new ApiClient($axios).get(`public/find?name=${newQuery.name}`)
        this.musicsSearch = data.musics
        this.albumsSearch = data.albums
         
        return newQuery.foo && oldQuery.bar
    }

    async asyncData({route, $axios}: Context) {
        try {
            const {data} = await new ApiClient($axios).get(`public/find?name=${route.query.name}`)
            
            return {
                name: route.query.name,
                musicsSearch: data.musics,
                albumsSearch: data.albums,
            }
        } catch (error) {
            return error
        }
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

