import { Context } from "@nuxt/types";
import store from "@/controllers";
import ApiClient from "@/library/ApiClient"
import config from "@/config"

async function checkLogin(context: Context) {
    try {
      const {data} = await context.$axios.get(config.api_url + "resource/users/me")
      store.user = data
      console.log(store.user);
    
      if (context.route.path === '/confirm-email' && store.user?.state === 'pending') {
        return
      } 
      // else if (store.user?.state === 'pending') {
      //   context.redirect("/confirm-email")
      // }
    } catch (error) {
      store.user.uid = null 
      store.user.email = null 
      store.user.first_name = null 
      store.user.last_name = null 
      store.user.role = null 
      store.user.bio = null 
      return error;
    }
}

async function getMusics(context: Context) {
  try {
    const musics = await new ApiClient(context.$axios).get("public/musics")
    const dataAlbum = await new ApiClient(context.$axios).get("public/albums")
    const newSongs = await new ApiClient(context.$axios).get("public/musics?order_by=view_count&ordering=desc&limit=10")

    const filterPendingData = musics.data.filter((music: any) => music.state !== "pending" )
    const filterPendingNewSongs = newSongs.data.filter((music: any) => music.state !== "pending" )

    store.music = filterPendingData
    store.albums = dataAlbum.data
    store.newSongs = filterPendingNewSongs

    const {data} = await new ApiClient(context.$axios).get("public/trending/musics/daily")
    
    const arrTrendingMusic: any = []
    const musicsStore: any = store.music
    for(let i = 0; i < data.length; i++) {
      for (let x = 0; x < musicsStore.length; x++) {
        if (data[i].music_id === musicsStore[x].id) {
          const music = musicsStore[x]
          music.today_view_count = data[i].today_view_count
          arrTrendingMusic.push(music)
        }
      }
    }
    store.trending = arrTrendingMusic
  } catch (error) {
    return error;
  }
}

export default async function (context: Context) {
  if (!store.first_route) return;

  await Promise.all([
    checkLogin(context),
    getMusics(context)
  ])
}
