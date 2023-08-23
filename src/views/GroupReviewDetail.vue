<template>
  <Header :title="groupDetail.name" @go-back="goBack"></Header>
  <div class="group-review-detail">
    <div class="group-review-detail-inner">
      <div class="group-review-detail-inner-block">
        <div class="title-container">
          <h3>Video</h3>
        </div>
        <div class="content-container" v-for="video in videoList">
          <video controls>
            <source :src="video" type="video/webm" />
          </video>
        </div>
      </div>
      <div class="group-review-detail-inner-block">
        <div class="title-container">
          <h3>Audio</h3>
        </div>
        <div class="content-container" v-for="audio in audioList">
          <audio controls :src="audio">
            <a href="/media/cc0-audio/t-rex-roar.mp3"> Download audio </a>
          </audio>
        </div>
      </div>
      <div class="group-review-detail-inner-block">
        <div class="title-container">
          <h3>Article</h3>
        </div>
        <div class="content-container" v-for="article in articleList">
          <div><a :href="article" target="_self">{{ article }}</a></div>
        </div>
      </div>
      <div class="review-words-btn-group">
        <el-button type="primary" @click="handleWordReview">单词复习</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus';
import { request } from '@/utils/service';
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


// #region variable
const groupID = ref('')
const route = useRoute()
const router = useRouter()
let groupDetail = ref('')
// #endregion

onMounted(() => {
  groupID.value = route.params.groupID as string
  if (!groupID.value) ElNotification({ type: 'warning', message: 'Params invalid.', duration: 900 })
  else getGroupDetail()
})

// #region function
function handleWordReview() {
  router.push('/recite/normal/?sharedGroupID=' + groupID.value)
}
function goBack() { router.go(-1) }

async function getGroupDetail() {
  const info = await request({ url: '/wordgroup/detail', method: 'post', data: { groupID: groupID.value } })
  console.log(info.data);
  groupDetail.value = info.data
}
// #endregion

const videoList = computed(() => {
  return groupDetail.value.groupMediaUrl?.split(',').filter(item => !!item)
})

const audioList = computed(() => {
  return groupDetail.value.groupAudioUrl?.split(',').filter(item => !!item)
})

const articleList = computed(() => {
  return groupDetail.value.groupArticleUrl?.split(',').filter(item => !!item)
})

</script>

<style scoped lang="less">
.group-review-detail {
  &-inner {
    width: 90%;
    margin: 15px auto 30px auto;

    &-block {
      border: 1px solid #eeeeee;
      border-radius: 5px;
      margin-bottom: 15px;
      padding: 8px 8px;
      box-sizing: border-box;

      .title-container {
        font-size: 15px;
        line-height: 40px;
        color: #333;
        height: 40px;

      }

      .content-container {}

      video {
        width: 100%;
      }
    }

    .review-words-btn-group {
      width: 100%;
      text-align: center;
    }
  }
}
</style>