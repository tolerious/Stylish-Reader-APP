<template>
  <Header title="good" @go-back="handleGoBack"></Header>
  <div class="review-word-container">
    <div class="review-word-container-inner">
      <div class="review-word-container-inner-title">
        <span>handle</span> 的含义是？
      </div>
      <div class="review-word-container-inner-body">
        <div class="review-word-container-inner-body-item" v-for="i in choiceList">
          <el-radio :label="i" v-model="answer" class="radio-class">
            处理，处置处理，处置处理，处置处理，处置处理，处置处理，处置处理，处置处理，处置处理，处置处理，处置处理，处置
          </el-radio>
        </div>
        <div class="btn-group">
          <el-button type="text">Prev</el-button>
          <el-button type="primary">Next</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// #region variable
const router = useRouter()
const route = useRoute()
const answer = ref('')
const choiceList = ref([1, 2, 3, 4])
// #endregion

// #region function
const handleGoBack = () => {
  router.go(-1)
}
// #endregion
</script>

<style scoped lang="less">
.review-word-container {
  width: 95%;
  padding: 10px 3px;
  border: 1px solid #eeeeee;
  border-radius: 5px;
  margin: 15px auto auto auto;
  box-sizing: border-box;

  &-inner {
    &-title {
      color: rgb(255, 124, 10);
      font-weight: bold;
      font-size: 16px;
      text-align: center;
    }

    &-body {
      margin-top: 25px;

      &-item:last-child {
        background-color: red;
      }

      &-item {
        height: auto;
        max-height: 100px;
        margin-bottom: 10px;
        border-bottom: 1px solid #eeeeee;
        padding: 5px;

        .radio-class {
          text-overflow: ellipsis;
          white-space: normal;
          line-height: 20px;
          font-size: 14px;
          // vertical-align: middle;
          display: inline-block;
        }
      }

      .btn-group {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
      }

    }
  }
}
</style>