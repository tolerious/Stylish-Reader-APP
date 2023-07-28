<template>
    <Header title="Manage Group" @go-back="handleGoBack" />
    <div class="group-manage-container">
        <el-form label-width="110px" :model="form" class="demo-from-inline">
            <el-form-item label="Group Name:">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
        </el-form>
        <div class="loop-word-item" v-for="group in groupList">
            <div class="loop-word-left">
                <div class="loop-word-left-top">{{ group.name }}</div>
                <div class="loop-word-left-bottom">{{ group.words > 0 ? group.words : 0 }} words</div>
            </div>
            <div class="loop-word-right">
                <button>
                    <span>Delete</span>
                </button>
            </div>
        </div>
        <div class="group-manage-bottom-btn">
            <el-button @click="createGroup" type="primary">Confirm</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { request } from '@/utils/service';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

// #region variable
const form = ref({ name: '' })
const router = useRouter()
let groupList = ref([])
// #endregion

// #region lifecycle
onMounted(async () => {
    groupList.value = await getGroupList()
    console.log(groupList.value);

})
// #endregion

// #region function
async function getGroupList() {
    const info = await request({
        url: '/wordgroup'
    })
    console.log(info.data);
    return info.data
}
async function createGroup() {
    if (form.value.name)
        request({
            url: '/wordgroup', method: 'post', data: {
                name: form.value.name
            }
        })
    form.value.name = ''
    groupList.value = await getGroupList()
}
function handleGoBack() {
    router.push('/')
}
// #endregion
</script>

<style scoped lang="less">
.group-manage-container {
    width: 90%;
    margin: 0 auto 40px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;

    .loop-word-item {
        height: 60px;
        border: 1px solid #eeeeee;
        box-shadow: 2px 2px 2px #eeeeee;
        width: 90%;
        border-radius: 5px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 5px;

        .loop-word-left {
            width: 70%;
            height: 100%;
            font-size: 14px;

            .loop-word-left-top {
                height: 60%;
            }

            .loop-word-left-bottom {
                height: 40%;
            }
        }

        .loop-word-right {
            width: 30%;
            height: 100%;
            line-height: 60px;
            text-align: center;

            button {
                margin: 0;
                background-color: #eeeeee;
                padding: 3px 5px;
                border-radius: 3px;
            }

            span {
                background: linear-gradient(to right, red, blue);
                color: transparent;
                background-clip: text;
                -webkit-background-clip: text;
            }
        }
    }

    .group-manage-bottom-btn {
        position: fixed;
        bottom: 20px;
        text-align: center;
        width: 100%;
        // background-color: white;

    }
}
</style>