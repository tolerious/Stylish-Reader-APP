<template>
  <Header title='Group Setting' @go-back="goBack"></Header>
  <div class="group-setting-container">
    <el-form :model="groupForm" label-width="50px">
      <el-form-item label="Name">
        <el-input placeholder="Input group name" v-model="groupForm.groupName"></el-input>
      </el-form-item>
      <template v-if="!groupForm.hasChild">
        <el-form-item label="Video">
          <el-input placeholder="Input video url,split with ','" v-model="groupForm.groupMediaUrl"
            type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="Audio">
          <el-input placeholder="Input audio url,split with ','" v-model="groupForm.groupAudioUrl"
            type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="Article">
          <el-input placeholder="Input article url,split with ','" v-model="groupForm.groupArticleUrl"
            type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="Public"> <el-switch v-model="groupForm.isPublic" /></el-form-item>
      </template>
      <el-form-item label="Parent">
        <el-select style="width: 100%;" v-model="groupForm.parentGroupID" @change="handleChange">
          <el-option value=""></el-option>
          <el-option v-for="group in groupList" :key="group._id" :value="group._id" :label="group.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="info" @click="goSharing" v-if="!groupForm.hasChild">Sharing</el-button>
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
  groupAudioUrl: '',
  groupArticleUrl: '',
  isPublic: false,
  parentGroupID: '',
  hasChild: false,
})
const router = useRouter()
const route = useRoute()
const groupID = ref('')
let groupList = ref([])
// #endregion

// #region lifecycle
onMounted(() => {
  groupID.value = route.params.groupID
  getGroupDetail()
  getGroupList()
})
// #endregion

// #region function

const handleChange = () => { }

const goSharing = () => {
  router.push('/sharing/' + groupID.value)
}

const getGroupDetail = async (id) => {
  let info = await request({ url: '/wordgroup/detail', data: { groupID: groupID.value }, method: 'post' })
  let d = info.data
  groupForm.value.groupName = d.name
  groupForm.value.groupMediaUrl = d.groupMediaUrl
  groupForm.value.groupArticleUrl = d.groupArticleUrl
  groupForm.value.groupAudioUrl = d.groupAudioUrl
  groupForm.value.isPublic = d.isPublic
  groupForm.value.parentGroupID = d.parentGroupID
  groupForm.value.hasChild = d.hasChild
}

async function getGroupList() {
  const info = await request({
    url: '/wordgroup'
  })
  groupList.value = info.data.list.filter(item => item._id != groupID.value)
}

const onSubmit = async () => {
  let info = await request({
    url: '/wordgroup/update',
    data: {
      isPublic: groupForm.value.isPublic,
      groupID: groupID.value,
      parentGroupID: groupForm.value.parentGroupID,
      name: groupForm.value.groupName,
      groupMediaUrl: groupForm.value.groupMediaUrl,
      groupAudioUrl: groupForm.value.groupAudioUrl,
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