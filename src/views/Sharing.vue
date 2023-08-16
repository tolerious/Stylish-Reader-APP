<template>
  <div class="sharing-container">
    <div class="sharing-inner-container">
      <div class="qr-code-container">
        <img src="@/assets/images/qr-code-sharing.png" alt="" srcset="">
      </div>
      <div class="content-container">
        <div class="title-container">
          <span>Stories for Children</span>
        </div>
        <div class="second-container">
          <div class="second-container-left">
            <span>{{ groupCount }}个</span><span>已收录词组</span>
          </div>
          <div class="second-container-right">
            <span>{{ wordCount }}个</span><span>单词在本词组中</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { request } from '@/utils/service';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


// #region variable
let route = useRoute()
let groupCount = ref(0)
let wordCount = ref(0)
let groupID = ref('')
// #endregion

onMounted(async () => {
  groupID.value = route.params.groupID
  await getAllGroupCount()
  await getWordList()
})

// #region function
async function getAllGroupCount() {
  const info = await request({ url: '/wordgroup/count', })
  groupCount.value = info.data
}
async function getWordList() {
  const info = await request({ url: '/wordgroup/word/count', data: { groupID: groupID.value }, method: 'post' });
  wordCount.value = info.data
}
// #endregion

</script>

<style scoped lang="less">
.sharing-container {
  // background-color: rgb(255, 124, 10);
  height: 100%;
  border-top: 1px solid transparent;
  background-image: url('@/assets/images/bg-1.png');
  background-size: cover;

  .sharing-inner-container {
    // border: 1px dashed rgb(255, 124, 10);
    width: 90%;
    height: 65%;
    background-color: white;
    margin: 28% auto;
    border-radius: 5px;

    .qr-code-container {
      width: 70%;
      text-align: center;
      margin: 0 auto;
      height: 70%;
      display: flex;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;

      img {
        width: 100%;
      }
    }

    .content-container {
      height: 30%;

      .title-container {
        text-align: center;
        font-size: 18px;
        height: 50%;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
      }

      .second-container {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        height: 50%;
        // background-color: blue;

        &-left,
        &-right {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;

          &>span:first-child {
            font-size: 22px;
            color: #333;
            font-weight: bold;
          }

          &>span:last-child {
            font-size: 14px;
            color: #333;
          }
        }
      }
    }

  }
}
</style>