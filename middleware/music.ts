import { Context } from "@nuxt/types";
import store from "@/controllers/store";
import ApiClient from "@/library/ApiClient"

export default async function (context: Context) {
  if(!store.value.music) {
    try {
      const musics = await new ApiClient(context.$axios).get("public/musics")
      const dataAlbum = await new ApiClient(context.$axios).get("public/albums")
      const newSongs = await new ApiClient(context.$axios).get("public/musics?order_by=view_count&ordering=desc&limit=10")

      const filterPendingData = musics.data.filter((music: any) => music.state !== "pending" )
      const filterPendingNewSongs = newSongs.data.filter((music: any) => music.state !== "pending" )

      store.value.music = filterPendingData
      store.value.albums = dataAlbum.data
      store.value.newSongs = filterPendingNewSongs

      const {data} = await new ApiClient(context.$axios).get("public/trending/musics/daily")
      
      const arrTrendingMusic: any = []
      const musicsStore: any = store.value.music
      for(let i = 0; i < data.length; i++) {
        for (let x = 0; x < musicsStore.length; x++) {
          if (data[i].music_id === musicsStore[x].id) {
            const music = musicsStore[x]
            music.today_view_count = data[i].today_view_count
            arrTrendingMusic.push(music)
          }
        }
      }
      store.value.trending = arrTrendingMusic
    } catch (error) {
      return error;
    }
  }

 
}
