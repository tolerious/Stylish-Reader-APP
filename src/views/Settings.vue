<template>
    <Header title="Settings" @go-back="handleGoBack" />
    <div class="settings-container">
        <el-descriptions title="User Settings">
            <el-descriptions-item label="Default Group">
                <el-select v-model="defaultGroup" @change="handleChange">
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

// #region variable
let defaultGroup = ref('')
let groupList = ref([])
const router = useRouter()
// #endregion

// #region lifecycle
onMounted(async () => {
    getGroupList()
    getDefaultGroup()
})
// #endregion

// #region function
async function handleChange(e) {
    console.log(e);
    const info = await request({
        url: '/usersetting', method: 'post', data: { defaultGroupID: e }
    })


}
function handleGoBack() {
    router.push('/')
}
async function getGroupList() {
    const info = await request({
        url: '/wordgroup'
    })
    console.log(info.data);
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