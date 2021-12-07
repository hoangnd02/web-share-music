<template>
<div class="container">
    <div class="update-profile-container" style="display: flex">
        <div class="update-profile-container-right">
            <AuthForm title="Update music" class="update-profile-container-right-form" @submit.prevent="updateMusic">
                <AuthInput v-model="musicItem.name" label="Name" :required="true" />
                <AuthInput v-model="musicItem.author" label="Author" :required="true" />
                <div class="form-block">
                    <div class="form-block-label">
                        Image
                    </div>
                    <label for="input-file-avatar" style="margin-top: 10px;">
                        <img v-if="url_image !== ''" :src="url_image" />
                        <img v-else :src="'http://localhost:3000/api/v2/public/musics/' + musicItem.id + '/image'" alt="" />
                    </label>
                    <input id="input-file-avatar" class="input-file" type="file" style="width: 200px" @change="onImageChanged" />
                </div>
                <div class="form-block">
                    <div class="form-block-label">
                        File music mp3
                    </div>
                    <label for="input-file-music" style="margin-top: 10px;">
                        <div v-if="url_music !== ''">
                            <audio controls>
                                <source :src="url_music" type="audio/ogg">
                            </audio>
                        </div>
                        <div v-else class="input-file-music-button">Choose files to upload</div>
                    </label>
                    <input id="input-file-music" class="input-file" type="file" style="width: 200px" @change="onFileChanged" />
                </div>
                <AuthInput v-model="musicItem.description" label="Description" :required="true" />
                <div class="update-profile-container-right-form-btn">
                    <button type="submit">Submit</button>
                </div>
            </AuthForm>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    Component,
    Mixins
} from 'vue-property-decorator'
import ApiClient from '~/library/ApiClient'
import MusicMixin from '~/mixins/music'
import ApiClient from "@/library/ApiClient"

@Component({
    middleware: "auth",
    components: {},
})
export default class music_id extends Mixins(MusicMixin) {
    musicItem: any = {}
    url_image: string = ""
    url_music: string = ""
    music: File 
    image: File

    layout() {
        return 'music'
    }

    head() {
        return {
            title: "Update music"
        }
    }

    async asyncData({params, $axios}: { params: any, $axios: any }) {
        try {
            const {data} = await new ApiClient($axios).get(`public/musics/${params.id}`)
            return {
                musicItem: data
            }
        } catch (error) {
            return error
        }
    }

    onImageChanged(event: any) {
        this.image = event.target.files[0];
        this.url_image = URL.createObjectURL(this.image);
    }

    onFileChanged(event: any) {
        this.music = event.target.files[0];
        this.url_music = URL.createObjectURL(this.musicItem.music);
    }

    async updateMusic() {
        try {
            const form = new FormData()
            form.append("name", this.musicItem.name)
            form.append("author", this.musicItem.author)
            form.append("description", this.musicItem.description || "")
            form.append("state", "active")
            if(this.image) {
                form.append("image", this.image as File)
            }
            if( this.music) {
                form.append("music", this.music as File)
            }
            await new ApiClient().put(`admin/musics/${this.musicItem.id}`, form)
            await this.getAllMusics()
            await this.$router.push("/profile")
        } catch (error) {
            return error
        }
    }
}
</script>

<style lang="less">
.container {
    background-color: #f2f4f8;
    display: flex;
    justify-content: center;
    padding: 30px;

    .update-profile-container {
        width: 80%;
        display: flex;
        margin: auto;
        background-color: #fff;
        padding: 40px 20px;

        &-right {
            flex: 1;
            padding: 20px 60px;

            &-form {

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
                        background-color: #4cb6cb;
                        outline: none;
                        border: none;
                        border-radius: 10px;
                        color: #fff;
                    }
                }
            }
        }
    }
}
</style>
