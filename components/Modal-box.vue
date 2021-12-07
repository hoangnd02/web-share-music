<template>
    <div v-if="enabled" class="modal">
        <template v-if="type === 'update'">
            <div class="modal-box">
                <div class="close-modal" @click="destroy"><i class="fas fa-times"></i></div>
                <div class="modal-box-nav">
                    <div class="modal-box-nav-item" style="display: flex; margin: auto;" @click="setTabModal(1)">
                        Update a playlist
                    </div>
                </div>
                <form class="modal-box-create" @submit.prevent="updateAlbum()">
                    <AuthInput v-model="name" label="Playlist title" :required="true" />
                    <div class="form-block">
                        <div class="form-block-label">
                            Ảnh đại diện album
                        </div>
                        <label for="input-file-avatar" style="margin-top: 10px;">
                            <img v-if="url" :src="url" alt="">
                            <img v-else :src="`${config.api_url}public/albums/${album.id}/image`" />
                        </label>
                        <input id="input-file-avatar" class="input-file" type="file" style="width: 200px" @change="changImage" />
                    </div>
                    <AuthInput v-model="description" label="Description" :required="true"  />
                    <div v-for="(item, key) in albumMusic" :key="key" class="modal-box-create-list">
                        <div class="modal-box-create-list-item">
                            <div class="delete-music" @click="deleteMusic(key)"><i class="fas fa-times"></i></div>
                            <SongItem2 :song="item" />
                        </div>
                    </div>
                    <button class="modal-box-create-submit" type="submit">Save</button>
                </form>
            </div>
        </template>
        <template v-else>
            <div class="modal-box">
                <div class="close-modal" @click="destroy"><i class="fas fa-times"></i></div>
                <div class="modal-box-nav">
                    <div  class="modal-box-nav-item" @click="setTabModal(0)">Add to playlist</div>
                    <div class="modal-box-nav-item" @click="setTabModal(1)">Create a playlist</div>
                </div>
                <div v-if="tab_Modal === 0" class="modal-box-list">
                    <div v-for="(album, index) in getAllAlbums" :key="index" class="modal-box-list-item">
                        <div class="album">
                            <div class="album-avatar"><img :src="`${config.api_url}public/albums/${album.id}/image`" alt=""></div>
                            <div class="album-detail">
                                <div class="album-detail-name">{{album.name}}</div>
                                <div class="album-detail-musics">{{album.music.length}} <i class="fas fa-compact-disc"></i></div>
                            </div>
                            <form class="modal-box-create-submit" @click="addMusicToAlbum(album, currentSong.id)">
                                Add to playlist
                            </form>
                        </div>
                    </div>
                </div>
                <form v-else class="modal-box-create" @submit.prevent="createAlbum(currentSong.id)">
                    <AuthInput v-model="name" label="Playlist title" :required="true" />
                    <div class="form-block">
                        <div class="form-block-label">
                            Ảnh đại diện album
                        </div>
                        <label for="input-file-avatar" style="margin-top: 10px;">
                            <img v-if="url_image !== ''" :src="url_image" />
                            <img v-else src='https://i.pinimg.com/originals/03/2b/08/032b0870b9053a191b67dc8c3f340345.gif' alt="" />
                        </label>
                        <input id="input-file-avatar" class="input-file" type="file" style="width: 200px" @change="onImageChanged" />
                        <!-- <div v-if="error" class="error">{{ error }}</div> -->
                    </div>
                    <AuthInput v-model="description" label="Description" :required="true"  />
                    <div class="modal-box-create-list">
                        <div class="modal-box-create-list-item" style="margin-bottom: 20px;">
                            <AuthInput v-model="idMusic" :required="true" style="display: none;" />
                            <SongItem2 :song="currentSong" />
                        </div>
                    </div>
                    <button class="modal-box-create-submit" type="submit">Save</button>
                </form>
            </div>
        </template>
    </div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
} from 'vue-property-decorator';
import SongItem2 from './Song2/SongItem2.vue';
import MusicMixin from '~/mixins/music';
import store from '~/controllers/store';
import ApiClient from '~/library/ApiClient';
import ZNotification from '@/library/z-notification'
import config from "@/config"

@Component({
    components: {
        SongItem2,
    }
})
export default class Modal_box extends Mixins(MusicMixin) {
    type: string | null = null;
    album: any = {};
    name: string = ""
    description: string | null = ""
    image: File | null
    albumMusic: any = []
    url: string | null = null;
    tab_Modal: number = 1
    enabled = false
    idAlbumMusic: any[] = []

    get currentSong() {
        return store.value.currentSong
    }

    get getAllAlbums() {
        return store.value.albums
    }

    get getUpdateAlbum() {
        return store.value.updateAlbum
    }

    create(type: string, album: any) {
        this.type = type;
        this.enabled = true;
        this.album = album;
        this.name = album.name
        this.description = album.description 
        this.image = album.image
        this.albumMusic = album.music
        this.idAlbumMusic = this.getIdMusic(album.music)
    }

    create2(type: string) {
        this.type = type;
        this.enabled = true;
    }

    destroy() {
        this.enabled = false;
        this.album = {};
        this.name = ""
        this.description = ""
        this.url = null
        this.albumMusic = null
        this.idAlbumMusic = []
    }

    changImage(event: any) {
        this.image = event.target.files[0];
        this.url = URL.createObjectURL(this.image);
    }

    setTabModal(numberTab: number) {
        this.tab_Modal = numberTab
    }

    async createAlbum(idMusic: number) {
        if(this.name === "") return
        if(!this.image) return

        try {
            const form = new FormData()
            form.append('name', this.name);
            form.append('description', this.description || "");
            form.append('image', this.image as File);
            form.append('musics', JSON.stringify([idMusic]));
            await new ApiClient().post("/resource/albums", form)

            this.name = ""
            this.description = null
            this.image = null
            this.musics = []
            this.destroy()
            ZNotification.success({
                title: "success",
                description: "Create album successfully"
            })

            await this.getAlbums()
        } catch (error) {
            return error
        }
    }

    async updateAlbum() {
        if(this.name === "") return

        try {
            const form = new FormData()
            form.append("name", this.name)
            form.append("description", this.description || "")
            form.append("image", this.image as File)
            form.append("musics", JSON.stringify(this.idAlbumMusic))

            await new ApiClient().put(`resource/albums/${this.album.id}`, form)
            await this.getAlbums()
            this.destroy()
            ZNotification.success({
                title: "success",
                description: "Update album successfully"
            })
        } catch (error) {
            return error
        }
    }

    getIdMusic(albumMusic: any[]) {
        const arr: any[] = []
        albumMusic.map(item => arr.push(item.id))
        return arr
    }

    deleteMusic(index: number) {
        this.idAlbumMusic.splice(index, 1)
        this.albumMusic.splice(index, 1)
    }

    get config() {
        return config
    }
}
</script>

<style lang="less">
.modal {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    z-index: 999;
    cursor: pointer;
    padding: 80px;
    padding-top: 40px;

    &-box {
        position: relative;
        background-color: #fff;
        width: 600px;
        padding: 20px 50px;
        border-radius: 10px;

        &-nav {
            display: flex;
            padding: 1px 120px;
            justify-content: space-between;

            &-item {
                border-bottom: 2px solid transparent;
                padding: 4px 10px;
            }

            &-item:hover {
                border-bottom: 2px solid #4cb6cb;
            }
        }

        &-list {
            margin-top: 40px;

            &-item {    
                .album {
                    display: flex;
                    padding: 20px;

                    &-avatar {
                        margin-right: 30px;

                        img {
                            width: 60px;
                            height: 60px;
                            object-fit: cover;
                        }
                    }

                    &-detail {
                        flex: 1;
                        padding: 6px 0;
                        color: #545a5f;

                        &-name {
                            font-size: 16px;
                            margin-bottom: 8px;
                        }

                        &-musics {
                            font-size: 16px;

                            i {
                                margin-left: 4px;
                            }
                        }
                    }

                    .add-playlist {
                        border: 1px solid #ccc;
                        padding: 6px 8px;
                        margin: auto;
                        color: #fff;
                        background-color: #4cb6cb;
                        border-radius: 10px;
                        cursor: pointer;
                    }
                }

                .album:hover {
                    background-color: rgba(76, 182, 203, 0.3);
                }
            }
        }

        &-create {
            margin-top: 40px;

            &-title {
                font-size: 16px;
            }

            &-privacy {
                input {
                    margin-left: 30px;
                }
            }

            .form-block {

                    .input-file {
                        display: none;
                    }

                    label {
                        display: flex;
                        justify-content: center;

                        img {
                            width: 220px;
                            height: 220px;
                            object-fit: cover;
                        }

                    }

                    .input-file-music {
                        &-button {
                            padding: 10px;
                            color: #fff;
                            background-color: #4cb6cb;
                            border-radius: 10px;
                        }
                    }
                }

                &-input {
                    margin: 20px 0;
                    display: flex;
                    align-items: center;

                    span {
                        width: 160px;
                        display: block;
                    }

                    input {
                        flex: 1;
                        padding: 0 12px;
                        width: 100%;
                        height: 46px;
                        display: block;
                        background-color: #f5f7f9;
                        border: 1px solid #fff;
                        border-radius: 5px;
                        outline: none;
                    }
                }

                &-btn {
                    margin-top: 60px;
                    display: flex;
                    justify-content: center;

                    button {
                        padding: 10px 20px;
                        background-color: #fff;
                        outline: none;
                        border: 1px solid #4cb6cb;
                        border-radius: 10px;
                        color: #4cb6cb;
                    }

                    button:hover {
                        background-color: #fff;
                        color: #4cb6cb;
                    }
                }

            &-submit {
                text-align: center;
                border: 1px solid #4cb6cb;
                padding: 6px 18px;
                border-radius: 10px;
                background-color: #fff;
                color: #4cb6cb;
                cursor: pointer;
                display: flex;
                margin: auto;
            }
            &-submit:hover {
                color: #fff;
                background-color: #4cb6cb;
            }
        }
    }
}

.modal-box-create-list-item {
    position: relative;

    .delete-music {
        position: absolute;
        top: 10px;
        right: 10px;
    }
}
</style>
