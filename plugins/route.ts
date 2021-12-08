import store from "../controllers";

export default ({ app }: {app: any}) => {
    // Every time the route changes (fired on initialization too)
    app.router.afterEach((to: any, from: any) => {
        if(to.path === '/login' || to.path === '/register') {
            if (process.server) return;
            if(store.value.currentSong) {
                const wavesurfer: any = store.value.wavesurfer
                wavesurfer.destroy()
                store.value.isPlaying = false
            }
        }
        if(from.path === '/listen-music-detail') {
            store.value.isMusicDetail = ""
        } 
    })
}
