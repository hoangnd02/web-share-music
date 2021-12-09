import { Vue, Component } from 'vue-property-decorator';
import store from '~/controllers';
import ApiClient from '~/library/ApiClient';
import ZNotification from '@/library/z-notification'

@Component
export default class MusicMixin extends Vue {
    name: string = ""
    author: string = ""
    description: string | null = null
    state: string = "active"
    music: File
    image: File | any
    url_music: string = ''
    url_image: string = ''
    contentCmt: string = ''
    contentReply: string = ''
    idMusic: any = this.currentSong.id
    musics: any[] = []
    privacy: string = "true"
    idCmt: any = 8
    comments: any = []
    likeState: boolean = this.currentSong.liked
    likedMusics: any
    albums: any
    commentsAlbum: any = []

    get getUpdateAlbum(): any {
        return store.value.updateAlbum
    }

    albumId: number = this.getUpdateAlbum.id
    albumName: string = this.getUpdateAlbum.name
    albumDescription: string = this.getUpdateAlbum.description
    albumImage: File = this.getUpdateAlbum.image
    albumPrivate: string = "private"
    albumMusics: any[] = []

    onImageChanged(event: any) {
        this.image = event.target.files[0];
        this.url_image = URL.createObjectURL(this.image);
    }

    onFileChanged(event: any) {
        this.music = event.target.files[0];
        this.url_music = URL.createObjectURL(this.music);
    }

    checkLogin() {
        if(!store.value.user.uid) {
            return this.$router.push('/login')
        }
    }

    get currentSong(): any {
        return store.value.currentSong
    }

    async createMusic() {
        if(this.name === "") return
        if(this.author === "") return
        if(!this.image) return

        try {
            const form = new FormData()
            form.set('name', this.name);
            form.set('author', this.author);
            form.set('description', this.description || "");
            form.set('state', this.state);
            form.set('music', this.music as File);
            form.set('image', this.image as File);
            await new ApiClient().post("/resource/musics", form )
            ZNotification.success({
                title: "success",
                description: "Create music successfully"
            })
            this.$router.push("/")
        } catch (error) {
            return error;            
        }
    }

    async getAllMusics() {
        try {
            const [musicResp1, musicResp2]  = await Promise.all([
                new ApiClient().get("resource/musics"), 
                new ApiClient().get("public/musics?order_by=view_count&ordering=desc&limit=10")
            ])

            const filterPendingData = musicResp1.data.filter((music: any) => music.state !== "pending" )
            const filterPendingNewSongs = musicResp2.data.filter((music: any) => music.state !== "pending" )

            this.musics = await filterPendingData
            store.value.music = await filterPendingData
            store.value.newSongs = await filterPendingNewSongs
        } catch (error) {
            return error
        }
    }

    async getMusic(id: number) {
        try {
            const {data} = await new ApiClient().get(`public/musics/${id}`)
            store.value.currentSong = await data
        } catch (error) {
            return error
        }
    }

    async like(id: number) {
        this.checkLogin()
        if(!store.value.user.uid) return
        try {
            const that = this
            if(Object.prototype.hasOwnProperty.call(store.value, 'currentSong')) {
                if(Object.prototype.hasOwnProperty.call(that.currentSong, 'liked')) {
                    that.currentSong.liked = true
                }
                that.currentSong.like_count += 1
            }
            await new ApiClient().post("/resource/musics/" + id + "/like")

            await new ApiClient().get("/resource/musics/" + id)

            await that.getAllMusics()
        } catch (error) {
            return error
        }
    }

    async unLike(id: number) {
        this.checkLogin()
        if(!store.value.user.uid) return
        try {
            const that = this
            if(Object.prototype.hasOwnProperty.call(store.value, 'currentSong')) {
                if(Object.prototype.hasOwnProperty.call(that.currentSong, 'liked')) {
                    that.currentSong.liked = false
                }
                that.currentSong.like_count -= 1
            }
            
            await new ApiClient().post("/resource/musics/" + id + "/unlike")

            await new ApiClient().get("/resource/musics/" + id)

            await that.getAllMusics()
        } catch (error) {
            return error
        }
    }

    async getAllComment() {
        try {
            const {data} = await new ApiClient().get(`public/musics/${this.currentSong.id}/comments`)
            this.comments = await data
        } catch (error) {
            return error
        }
    }

    async comment() {
        this.checkLogin()
        if(!store.value.user.uid) return
        try {
            await new ApiClient().post(`/resource/musics/${this.currentSong.id}/comment`, {
                content: this.contentCmt
            })
            this.contentCmt = ''
            await this.getAllComment()
        } catch (error) {
            return error
        }
    }

    async likeCmt(id: number) {
        this.checkLogin()
        if(!store.value.user.uid) return
        try {
            await new ApiClient().post("/resource/comments/" + id + "/like")

            await this.getAllComment()
        } catch (error) {
            return error
        }
    }

    async unLikeCmt(id: number) {
        this.checkLogin()
        if(!store.value.user.uid) return
        try {
            await new ApiClient().post("/resource/comments/" + id + "/unlike")

            await this.getAllComment()
        } catch (error) {
            return error
        }
    }

    async replyComment(id: number) {
        this.checkLogin()
        if(!store.value.user.uid) return
        try {
            await new ApiClient().post(`/resource/comments/reply`, {
                comment_id: id,
                content: this.contentReply
            })

            this.contentReply = ''

            await this.getAllComment()
        } catch (error) {
            return error
        }
    }

    async likeReply(id: number) {
        this.checkLogin()
        if(!store.value.user.uid) return
        try {
            await new ApiClient().post("/resource/comments/reply/" + id + "/like")

            await this.getAllComment()
        } catch (error) {
            return error
        }
    }

    async unLikeReply(id: number) {
        this.checkLogin()
        if(!store.value.user.uid) return
        try {
            await new ApiClient().post("/resource/comments/reply/" + id + "/unlike")

            await this.getAllComment()
        } catch (error) {
            return error
        }
    }

    async getAlbums() {
        try {
            const {data} = await new ApiClient().get("public/albums")
            this.albums = await data
            store.value.albums = await data
        } catch (error) {
            return error
        }
    }

    async getAlbum(albumId: number) {
        try {
            const {data} = await new ApiClient().get(`resource/albums/${albumId}`)
            return data
        } catch (error) {
            return error
        }
    }

    async addMusicToAlbum(album: any, idMusic: number) {
        try {
            const Arr: any = [] 
            album.music.map((music: any) => Arr.push(music.id))

            const form = new FormData()
            form.append("name", album.name)
            form.append("musics", JSON.stringify([...Arr, idMusic]))

            await new ApiClient().put(`resource/albums/${album.id}`, form)
            
            ZNotification.success({
                title: "success",
                description: "Add music to album successfully"
            })
            await this.getAlbums()
        } catch (error) {
            return error
        }
    }

    async getAllCommentAlbum() {
        try {
            const {data} = await new ApiClient().get(`public/albums/${store.value.currentAlbum.id}/comments`)
            this.commentsAlbum = await data
        } catch (error) {
            return error
        }
    }

    async commentAlbum() {
        this.checkLogin()
        if(!store.value.user.uid) return
        try {
            await new ApiClient().post(`/resource/albums/${store.value.currentAlbum.id}/comment`, {
                content: this.contentCmt
            })
            this.contentCmt = ''
            await this.getAllCommentAlbum()
        } catch (error) {
            return error
        }
    }

    async replyAlbum() {
        try {
            await new ApiClient().post(`/resource/albums/${store.value.currentAlbum.id}/reply`, {
                content: this.contentCmt
            })
            this.contentCmt = ''
            await this.getAllCommentAlbum()
        } catch (error) {
            return error
        }
    }


    async likeAlbum(id: number) {
        this.checkLogin()
        if(!store.value.user.uid) return
        try {
            const that = this

            await new ApiClient().post("/resource/albums/" + id + "/like")

            if(Object.prototype.hasOwnProperty.call(store.value, 'currentAlbum')) {
                if(Object.prototype.hasOwnProperty.call(store.value.currentAlbum, 'liked')) {
                    store.value.currentAlbum.liked = true
                }
                store.value.currentAlbum.like_count += 1
            }
            await that.getAllMusics()
        } catch (error) {
            return error
        }
    }

    async unLikeAlbum(id: number) {
        this.checkLogin()
        if(!store.value.user.uid) return
        try {
            const that = this

            await new ApiClient().post("/resource/albums/" + id + "/unlike")

            if(Object.prototype.hasOwnProperty.call(store.value, 'currentAlbum')) {
                if(Object.prototype.hasOwnProperty.call(store.value.currentAlbum, 'liked')) {
                    store.value.currentAlbum.liked = false
                }
                store.value.currentAlbum.like_count -= 1
            }
            await that.getAllMusics()
        } catch (error) {
            return error
        }
    }


    // async deleteAlbum(id: number) {
    //     try {
    //         await new ApiClient().delete(`resource/albums/${id}`)
    //         await this.getAlbums()
    //         ZNotification.success({
    //             title: "success",
    //             description: "Delete album successfully"
    //         })
    //     } catch (error) {
    //         return error
    //     }
    // }
}
