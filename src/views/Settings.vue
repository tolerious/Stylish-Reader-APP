<template>
    <Header title="用户设置" @go-back="handleGoBack" />
    <div class="settings-container">
        <el-descriptions title="" direction="vertical" :column="1">
            <template #extra>
                <button
                    @click="logout"
                    class="bg-pink-600 active:shadow-sm active:shadow-gray-500 px-3 py-2 rounded-md text-white font-bold"
                >
                    退出登录
                </button>
            </template>
            <el-descriptions-item label="用户名">
                <el-input v-model="username" disabled></el-input>
            </el-descriptions-item>
        </el-descriptions>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { request } from '@/utils/service';
import { ElNotification } from 'element-plus';

// #region variable
let defaultGroup = ref('');
let groupList = ref([]);
const router = useRouter();
let username = ref('');
// #endregion

// #region lifecycle
onMounted(async () => {
    getGroupList();
    getDefaultGroup();
    username.value = localStorage.getItem('username');
});
// #endregion

// #region function
function logout() {
    router.push('/enter');
}
async function handleChange(e) {
    if (!e) {
        ElNotification({ message: "Default group can't be none.", type: 'warning', duration: 1200 });
        return;
    }
    const info = await request({
        url: '/usersetting',
        method: 'post',
        data: { defaultGroupID: e },
    });
    if (info.code === 200) {
        ElNotification({ message: 'Update Successfully', type: 'success', duration: 1200 });
    } else {
        ElNotification({ message: 'Update Filed', type: 'error', duration: 1200 });
    }
}
function handleGoBack() {
    router.push('/home');
}
async function getGroupList() {
    const info = await request({
        url: '/wordgroup/child',
    });
    groupList.value = info.data;
}
async function getDefaultGroup() {
    const info = await request({
        url: '/usersetting',
    });
    if (info.data.length > 0) defaultGroup.value = info.data[0].defaultGroupID;
}
// #endregion
</script>

<style scoped>
.settings-container {
    width: 90%;
    margin: 0 auto 30px auto;
    margin-top: 15px;
}
</style>
