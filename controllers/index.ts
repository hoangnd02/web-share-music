import store from "./store";

class Controller {
    store = store;

    get value() {
        return this.store.value;
    }

    get first_route() {
        return this.store.value.first_route;
    }

    set first_route(first_route) {
        this.store.value.first_route = first_route;
    }

    get wavesurfer() {
        return this.store.value.wavesurfer;
    }

    set wavesurfer(wavesurfer) {
        this.store.value.wavesurfer = wavesurfer;
    }

    get music() {
        return this.store.value.music;
    }

    set music(music) {
        this.store.value.music = music;
    }

    get playlist() {
        return this.store.value.playlist;
    }

    set playlist(playlist) {
        this.store.value.playlist = playlist;
    }

    get currentSong() {
        return this.store.value.currentSong;
    }

    set currentSong(currentSong) {
        this.store.value.currentSong = currentSong;
    }

    get currentAlbum() {
        return this.store.value.currentAlbum;
    }

    set currentAlbum(currentAlbum) {
        this.store.value.currentAlbum = currentAlbum;
    }

    get albums() {
        return this.store.value.albums;
    }

    set albums(albums) {
        this.store.value.albums = albums;
    }

    get isPlaying() {
        return this.store.value.isPlaying;
    }

    set isPlaying(isPlaying) {
        this.store.value.isPlaying = isPlaying;
    }

    get isLoading() {
        return this.store.value.isLoading;
    }

    set isLoading(isLoading) {
        this.store.value.isLoading = isLoading;
    }

    get indexPlaylist() {
        return this.store.value.indexPlaylist;
    }

    set indexPlaylist(indexPlaylist) {
        this.store.value.indexPlaylist = indexPlaylist;
    }

    get user() {
        return this.store.value.user;
    }

    set user(user) {
        this.store.value.user = user;
    }

    get isMusicDetail() {
        return this.store.value.isMusicDetail;
    }

    set isMusicDetail(isMusicDetail) {
        this.store.value.isMusicDetail = isMusicDetail;
    }

    get isLogin() {
        return this.store.value.isLogin;
    }

    set isLogin(isLogin) {
        this.store.value.isLogin = isLogin;
    }

    get destroyWavesuffer() {
        return this.store.value.destroyWavesuffer;
    }

    set destroyWavesuffer(destroyWavesuffer) {
        this.store.value.destroyWavesuffer = destroyWavesuffer;
    }

    get trending() {
        return this.store.value.trending;
    }

    set trending(trending) {
        this.store.value.trending = trending;
    }

    get updateAlbum() {
        return this.store.value.updateAlbum;
    }

    set updateAlbum(updateAlbum) {
        this.store.value.updateAlbum = updateAlbum;
    }

    get newSongs() {
        return this.store.value.newSongs;
    }

    set newSongs(newSongs) {
        this.store.value.newSongs = newSongs;
    }

    get getLogged() {
        return this.store.value.getLogged;
    }

    set getLogged(getLogged) {
        this.store.value.getLogged = getLogged;
    }

    get getAllMusics() {
        return this.store.value.getAllMusics;
    }

    set getAllMusics(getAllMusics) {
        this.store.value.getAllMusics = getAllMusics;
    }
}

export default new Controller();
