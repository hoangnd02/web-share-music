<template>
    <div class="profile-container-content-right-info-song2" :class="type === 'album-detail' ? 'hover' : ''">
        <div class="profile-container-content-right-info-song2-avatar" @click="setCurrentAlbum">
            <img :src="'/api/v2/public/albums/' + album.id + '/image'" alt="">
        </div>
        <div class="profile-container-content-right-info-song2-text" style="flex: 1;">
            <div class="profile-container-content-right-info-song2-text-name">{{album.name}}</div>
            <!-- <div class="profile-container-content-right-info-song2-text-description">
                <div class="profile-container-content-right-info-song2-text-description-text">
                    {{album.music.length}} <i class="fas fa-compact-disc"></i>
                </div>
            </div> -->
            <div class="profile-container-content-right-info-song2-text-list">
                <div class="profile-container-content-right-info-song2-text-list-item">
                    <i class="fas fa-play"></i>{{album.view_count}}
                </div>
                <div class="profile-container-content-right-info-song2-text-list-item">
                    <i class="fas fa-heart"></i>{{album.like_count}}
                </div>
                <div class="profile-container-content-right-info-song2-text-list-item">
                    <i class="fas fa-compact-disc"></i> {{album.music.length}}
                </div>
            </div>
        </div>
        <div v-if="type !== 'album-detail'" class="album-action" style="display: flex;">
            <div class="album-action-update al-item" style="margin-right: 10px;" @click="showModal">
                <div class="modal-box-create-submit">
                    Update
                </div>
            </div>
            <div class="album-action-delete al-item">
                <div class="modal-box-create-submit" @click="deleteAlbum(album.id)">
                    Delete
                </div>
            </div>
            <modal-box ref="modal" />
        </div>
    </div>
</template>

<script lang="ts">
import { mixins, Component, Prop,Ref } from 'nuxt-property-decorator';
import ModalBox from "../Modal-box.vue"
import MusicMixin from '~/mixins/music';
import store from '~/controllers';

@Component
export default class AlbumItem3 extends mixins(MusicMixin) {
    @Prop() album: any
    @Prop() type: string
    @Ref("modal") modalBox: ModalBox;

    get currentAlbum() {
        return store.value.currentAlbum
    }

    setCurrentAlbum() {
        store.value.currentAlbum = this.album
        this.$router.push('/album-detail')
    }

    showModal() {
        // console.log(this.$refs);
        this.modalBox.create("update", this.album);
    }
}
</script>

<style lang="less">
.profile-container-content-right-info-song2 {
    padding: 10px 30px;
    display: flex;
    width: 100%;

    &-avatar {
        padding-right: 30px;
        display: flex;
        align-items: center;

        img {
            width: 80px;
            height: 80px;
            object-fit: cover;
        }
    }

    &-text {
        color: #999;
        padding: 10px 0;

        &-name {
            font-size: 18px;
            line-height: 40px;
            margin-bottom: 12px;
        }

        &-author {
            color: #999;
            font-size: 14px;
            line-height: 22px;
        }

        &-description {
            display: flex;
            align-items: center;
            min-height: 46px;
            &-text {
                display: -webkit-box;
                font-size: 16px;
                overflow: hidden;
                text-overflow: ellipsis;
                -webkit-line-clamp: 3; 
                        line-clamp: 3; 
                -webkit-box-orient: vertical;
            }
        }

        &-list {
            display: flex;
            height: 30px;

            &-item {
                margin-right: 20px;
                font-size: 14px;
                display: flex;
                align-items: center;

                i {
                    margin-right: 6px;
                    zoom: 1;
                }
            }
        }
    }
}

.profile-container-content-right-info-song2:hover {
    background-color: rgba(76, 182, 203, 0.3)
}
</style>
