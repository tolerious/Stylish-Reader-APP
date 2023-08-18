<template>
  <div class="sharing-container" id="sharing-container" v-if="showDom">
    <div class="sharing-inner-container">
      <div class="qr-code-container">
        <img src="@/assets/images/qr-code-sharing.png" alt="" srcset="">
        <div><span>扫描二维码，开始学习！</span></div>
      </div>
      <div class="content-container">
        <div class="title-container">
          <span>词组：{{ groupForm.groupName }}</span>
        </div>
        <div class="second-container">
          <div class="second-container-item">
            <span class="second-container-item-first">{{ groupInfo.wordCount }} </span>
            <span class="second-container-item-second">单词</span>
          </div>
          <div class="second-container-item">
            <span class="second-container-item-first">{{ groupInfo.videoCount }} </span>
            <span class="second-container-item-second">视频</span>
          </div>
          <div class="second-container-item">
            <span class="second-container-item-first">{{ groupInfo.articleCount }} </span>
            <span class="second-container-item-second">文章</span>
          </div>
          <div class="second-container-item">
            <span class="second-container-item-first">{{ groupInfo.audioCount }} </span>
            <span class="second-container-item-second">音频</span>
          </div>
        </div>
      </div>
    </div>
    <div class="footer"><span>截至目前为止，APP 已收录{{ groupInfo.groupCount }}个词组</span></div>
  </div>
  <div id="sharing-pic-container" class="sharing-pic-container">
    <div class="sharing-pic-container-inner" v-if="!showDom">
      <el-button type="info" class="sharing-pic-container-btn" @click="goHome">回到首页</el-button>
      <el-button type="primary" class="sharing-pic-container-btn" @click="downloadBase64File">分享图片</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { request } from '@/utils/service';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import html2canvas from "html2canvas";
// #region variable
let route = useRoute()
let groupCount = ref(0)
let groupInfo = ref('')
let groupID = ref('')
let imgSrc = ref('')
let showDom = ref(true)
let dialogVisible = ref(true)
let imgBase = ref('')
let router = useRouter()
let groupForm = ref({
  groupName: '', hasChild: false
})
// #endregion

onMounted(async () => {
  groupID.value = route.params.groupID
  await getWordList()
  await getGroupDetail()


  html2canvas(document.querySelector("#app")).then(canvas => {
    showDom.value = false
    document.getElementById('sharing-pic-container')!.appendChild(canvas);
    let canvas1 = document.querySelector('canvas')
    let dataURL = canvas1.toDataURL()
    // var newTab = window.open('about:blank', 'image from canvas');
    // newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
    var img = new Image();
    img.src = dataURL;
    imgBase.value = dataURL
    img.style.height = '99vh'
    document.getElementById('sharing-pic-container')!.appendChild(img);
    canvas1.style.display = 'none'
  });

})

// #region function
const getGroupDetail = async (id) => {
  let info = await request({ url: '/wordgroup/detail', data: { groupID: groupID.value }, method: 'post' })
  let d = info.data
  groupForm.value.groupName = d.name
  groupForm.value.hasChild = d.hasChild
}
function downloadBase64File() {
  const linkSource = imgBase.value
  const downloadLink = document.createElement('a');
  document.body.appendChild(downloadLink);
  downloadLink.href = linkSource;
  downloadLink.target = '_self';
  downloadLink.download = groupID.value;
  downloadLink.click();
  downloadLink.style.display = 'none'
}

async function getWordList() {
  let info = await request({ url: '/wordgroup/sharing/count', data: { groupID: groupID.value }, method: 'post' });
  groupInfo.value = info.data
}

function goHome() {
  router.push('/home')
}
// #endregion

</script>

<style scoped lang="less">
.sharing-container {
  height: 100%;
  border-top: 1px solid transparent;
  background-image: url('@/assets/images/bg-1.png');
  background-size: cover;
  position: relative;

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
      flex-direction: column;
      justify-content: space-around;
      align-items: center;

      img {
        height: 100%;
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

        &-item {
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          align-items: center;
          padding: 0 8px;
          box-sizing: border-box;
          text-align: center;

          &-first {
            font-size: 22px;
            color: #333;
            font-weight: bold;
          }

          &-second {
            font-size: 14px;
            color: #333;
          }
        }
      }
    }

  }

  .footer {
    position: absolute;
    bottom: 3px;
    text-align: center;
    width: 100%;
    color: grey;
    font-size: 12px;
  }
}

.sharing-pic-container {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  position: relative;

  .sharing-pic-container-inner {
    position: absolute;
    bottom: 26px;
  }

  img {
    height: calc(100vh - 3px);
  }
}
</style>