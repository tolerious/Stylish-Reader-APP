<template>
  <Header title='Group Setting' @go-back="goBack"></Header>
  <div class="group-setting-container">
    <el-form :model="groupForm" label-width="50px">
      <el-form-item label="Name">
        <el-input placeholder="Input group name" v-model="groupForm.groupName"></el-input>
      </el-form-item>
      <el-form-item label="Media">
        <el-input placeholder="Input video url,split with ','" v-model="groupForm.groupMediaUrl"
          type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="Article">
        <el-input placeholder="Input article url,split with ','" v-model="groupForm.groupArticleUrl"
          type="textarea"></el-input>
      </el-form-item>
      <el-form-item label="Public"> <el-switch v-model="groupForm.isPublic" /></el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Update</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { request } from '@/utils/service';
import { ElNotification } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// #region variable
const groupForm = ref({
  groupName: '',
  groupMediaUrl: '',
  groupArticleUrl: '',
  isPublic: false,
})
const router = useRouter()
const route = useRoute()
const groupID = ref('')
// #endregion

// #region lifecycle
onMounted(() => {
  groupID.value = route.params.groupID
  getGroupDetail()
})
// #endregion

// #region function
const getGroupDetail = async (id) => {
  let info = await request({ url: '/wordgroup/detail', data: { groupID: groupID.value }, method: 'post' })
  let d = info.data
  groupForm.value.groupName = d.name
  groupForm.value.groupMediaUrl = d.groupMediaUrl
  groupForm.value.groupArticleUrl = d.groupArticleUrl
  groupForm.value.isPublic = d.isPublic
}
const onSubmit = async () => {
  let info = await request({
    url: '/wordgroup/update',
    data: {
      isPublic: groupForm.value.isPublic,
      groupID: groupID.value,
      name: groupForm.value.groupName,
      groupMediaUrl: groupForm.value.groupMediaUrl,
      groupArticleUrl: groupForm.value.groupArticleUrl,
    }, method: 'post'
  })
  if (info.code == 200) {
    ElNotification({ type: 'success', message: 'Update Successfully', duration: 1000 })
  } else {
    ElNotification({ type: 'error', message: info.msg, duration: 1000 })

  }
}
const goBack = () => {
  router.go(-1)
}
// #endregion
</script>

<style scoped lang="less">
.group-setting-container {
  width: 95%;
  margin: 0 auto;
  border: 1px solid #eeeeee;
  border-radius: 5px;
  padding: 10px 3px;
  box-sizing: border-box;
}
</style>