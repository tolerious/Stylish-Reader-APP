<template>
  <Header :title="groupDetail.name" @go-back="goBack"></Header>
  <div class="group-review-detail">
    <div class="group-review-detail-inner">
      <div class="group-review-detail-inner-block">
        <div class="title-container">Video</div>
        <div class="content-container">
          <video controls>
            <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/webm" />
          </video>
        </div>
      </div>
      <div class="group-review-detail-inner-block">
        <div class="title-container">Audio</div>
        <div class="content-container">
          <audio controls src="/media/cc0-audio/t-rex-roar.mp3">
            <a href="/media/cc0-audio/t-rex-roar.mp3"> Download audio </a>
          </audio>
        </div>
      </div>
      <div class="group-review-detail-inner-block">
        <div class="title-container">Article</div>
        <div class="content-container">
          <p>
            Visitors check out a virtual power plant system during the World Artificial Intelligence Conference in
            Shanghai in August 2019. [GAO YUWEN/FOR CHINA DAILY]

            Greater efforts are needed to advance the technologies of market entities such as solar and wind energy
            generators, electricity storage facilities and virtual power plants to accelerate their transition into a new
            power system, experts said.

            Meanwhile, mechanisms that allow electricity users to take responsibility for their carbon emissions should
            also be introduced, they said.

            Compared to traditional methods, the new system envisages a move away from reliance on fossil fuels to one
            based on new energy sources to generate electricity.

            It involves gradually increasing the proportion of renewable energy, such as solar and wind power, in
            electricity generation.

            At the same time, an upgrade to the transmission grid will ensure that the new power system will efficiently
            harness new energy sources and facilitate a smoother integration of various power loads, as well as enhance
            electrification use, the experts said, adding that these are essential to achieving China's green goals.

            Zhang Jieqing, China program director of the Natural Resources Defense Council, said the current power system
            is hampered by the large-scale integration of power generated from renewable energy sources and extreme
            weather.

            "The evolving supply-demand dynamic is making power system operations more complex, with issues arising from
            intermittent new energy sources, insufficient system flexibility, and heightened difficulties in load control.
            Urgent low-carbon transformation of the power system is imperative to combat climate change," Zhang said.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ElNotification } from 'element-plus';
import { request } from '@/utils/service';
import { onMounted, ref } from 'vue';
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
function goBack() { router.go(-1) }

async function getGroupDetail() {
  const info = await request({ url: '/wordgroup/detail', method: 'post', data: { groupID: groupID.value } })
  console.log(info.data);
  groupDetail.value = info.data
}
// #endregion

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
      padding: 0 8px;
      box-sizing: border-box;

      .title-container {
        font-size: 15px;
        line-height: 30px;
        color: #333;
        height: 30px;
      }

      video {
        width: 100%;
      }
    }
  }
}</style>