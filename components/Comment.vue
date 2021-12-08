<template>
<div :class="'comment-list-item-' + type">
    <div class="comment-list-item-avatar">
        <img :src="'api/v2/public/users/' + getComment.user_uid + '/avatar'" alt="">
    </div>
    <div class="comment-list-item-detail">
        <div class="comment-list-item-detail-top">
            <div class="comment-list-item-detail-top-username"><span>{{getComment.first_name + " " +  getComment.last_name }}</span></div>
        </div>
        <div class="comment-list-item-detail-center">
            {{commentContent}}
        </div>
        <div class="comment-list-item-detail-bot">
            <div class="comment-list-item-detail-bot-time">{{formatDateTime()}}</div>
            <div class="comment-list-item-detail-bot-reply" @click="showReplyCmt(indexCmt)">Trả lời</div>
        </div>
    </div>
    <div v-if="type === 'reply'" style="position: relative;">
        <div class="comment-list-item-detail-react" >
            <div :class="'stage ' + getSetLikedState" style="margin-top: -12px;" @click="setLikedState2">
                <div class="heart" style="zoom: 0.6;"></div>
                <div style="margin-top: -18px;">{{likeCount}}</div>
            </div>
        </div>
    </div>
    <div v-else style="position: relative;">
        <div class="comment-list-item-detail-react">
            <div :class="'stage ' + getSetLikedState" style="margin-top: -12px;" @click="setLikedState">
                <div class="heart" style="zoom: 0.6;"></div>
                <div style="margin-top: -18px;">{{likeCount}}</div>
            </div>
        </div>
    </div>
</div>
</template>

<script lang="ts">
import {
    Component,
    Mixins,
    Prop,
} from 'vue-property-decorator';
import store from '~/controllers';
import MusicMixin from '~/mixins/music';

@Component
export default class Comment extends Mixins(MusicMixin) {
    @Prop() type: string
    @Prop() showReplyCmt: any
    @Prop() indexCmt: string
    @Prop() commentItem: any

    isLike: string = this.likedComment ? "is-active" : "" 
    likeCount: number = this.commentLikeCount

    get getComment() {
        return this.commentItem
    }

    get commentContent() {
        return this.commentItem.content
    }

    get likedComment() {
        return this.commentItem.liked
    }

    get commentLikeCount() {
        return this.commentItem.like_count
    }


    get commentId() {
        return this.commentItem.id
    }

    get user() {
        return store.value.user
    }

    setLikedState() {
        if(this.isLike === "") {
            this.isLike = "is-active"
            this.likeCmt(this.commentId)
            this.likeCount += 1
        } else {
            this.isLike = ""
            this.unLikeCmt(this.commentId)
            this.likeCount -= 1
        }
    }

    get getSetLikedState() {
        return this.isLike
    }

    formatDateTime() {
        return this.commentItem.created_at.slice(0, 10)
    }

    setLikedState2() {
        if(this.isLike === "") {
            this.isLike = "is-active"
            this.likeReply(this.commentId)
            this.likeCount += 1
        } else {
            this.isLike = ""
            this.unLikeReply(this.commentId)
            this.likeCount -= 1
        }
    }
}
</script>

<style lang="less">
.stage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);

    .heart {
        width: 100px;
        height: 100px;
        background: url("https://cssanimation.rocks/images/posts/steps/heart.png") no-repeat;
        background-position: 0 0;
        cursor: pointer;
        transition: background-position 1s steps(28);
        transition-duration: 0s;

    }
}

.is-active {
    .heart {
        background-position: -2800px 0;
        transition-duration: 1s;
    }
}

.comment-list-item-main,
.comment-list-item-reply {
    display: flex;
    // padding: 4px 0;

    .comment-list-item-avatar {
        margin-right: 10px;

        img {
            border-radius: 500px;
            width: 40px;
            height: 40px;
            object-fit: cover;
        }
    }

    .comment-list-item-detail {
        flex: 1;

        &-top {
            padding-bottom: 1px;

            &-username {
                font-size: 16px;
                color: rgb(22, 24, 35);
                font-weight: 500;
            }
        }

        &-center {
            font-size: 16px;
            line-height: 22px;
            color: rgb(18, 18, 18);
            padding-right: 30px;
        }

        &-bot {
            display: flex;
            margin-top: 6px;

            &-time {
                font-size: 14px;
            }

            &-reply {
                margin-left: 24px;
                font-size: 15px;
                cursor: pointer;
            }
        }

        &-react {
            font-size: 12px;
            min-width: 20px;
            text-align: center;

            &-number {
                padding-bottom: 20px;
                margin-top: -18px;
            }
        }
    }

}

.comment-list-item-main-reply {
    padding-left: 50px;

    .comment-list-item-avatar {
        margin-right: 10px;

        img {
            border-radius: 500px;
            width: 30px;
            height: 30px;
            object-fit: cover;
        }
    }
}
</style>
