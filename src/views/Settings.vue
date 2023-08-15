<template>
    <Header title="Settings" @go-back="handleGoBack" />
    <div class="settings-container">
        <el-descriptions title="User Settings" direction="vertical" :column="1">
            <template #extra>
                <el-button type="primary" @click="logout">Log Out</el-button>
            </template>
            <el-descriptions-item label="UserName">
                <el-input v-model="username" disabled=""></el-input>
            </el-descriptions-item>
            <el-descriptions-item label="Default Group">
                <el-select style="width: 100%;" v-model="defaultGroup" @change="handleChange">
                    <el-option value=""></el-option>
                    <el-option v-for="group in groupList" :key="group._id" :value="group._id"
                        :label="group.name"></el-option>
                </el-select>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { request } from '@/utils/service';
import { ElNotification } from 'element-plus';

// #region variable
let defaultGroup = ref('')
let groupList = ref([])
const router = useRouter()
let username = ref('')
// #endregion

// #region lifecycle
onMounted(async () => {
    getGroupList()
    getDefaultGroup()
    username.value = localStorage.getItem('username')
})
// #endregion

// #region function
function logout() {
    router.push('/login')
}
async function handleChange(e) {
    if (!e) {
        ElNotification({ message: "Default group can't be none.", type: 'warning', duration: 1200 })
        return
    }
    const info = await request({
        url: '/usersetting', method: 'post', data: { defaultGroupID: e }
    })
    if (info.code === 200) {
        ElNotification({ message: 'Update Successfully', type: 'success', duration: 1200 })
    } else {
        ElNotification({ message: 'Update Filed', type: 'error', duration: 1200 })
    }


}
function handleGoBack() {
    router.push('/home')
}
async function getGroupList() {
    const info = await request({
        url: '/wordgroup/child'
    })
    groupList.value = info.data
}
async function getDefaultGroup() {
    const info = await request({
        url: '/usersetting'
    })
    if (info.data.length > 0)
        defaultGroup.value = info.data[0].defaultGroupID

}
// #endregion

</script>

<style scoped>
.settings-container {
    width: 90%;
    margin: 0 auto 30px auto;
}
</style>