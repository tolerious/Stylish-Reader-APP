<template>
    <Header title="Word List" @goBack="handleGoBack" />
    <div class="loop-word-container">
        <div v-if="groupList.length > 0" class="loop-word-item" v-for="group in groupList">
            <div class="loop-word-left">
                <div class="loop-word-left-top">{{ group.name }}</div>
                <div class="loop-word-left-bottom">{{ group.wordCount }} words</div>
            </div>
            <div class="loop-word-right">
                <button @click="redirect(group._id)">
                    <span>Manage</span>
                </button>
            </div>
        </div>
        <el-empty description="No Data." v-else />
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { request } from '@/utils/service';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
// #region variable
const router = useRouter()
let groupList = ref([])
let groupID = ref('')
// #endregion

// #region lifecycle
onMounted(() => {
    getGroupList()
})
// #endregion

// #region function
async function redirect(id) {
    router.push('/wordlist/' + id)
}
async function getGroupList() {
    const info = await request({
        url: '/wordgroup'
    })
    groupList.value = info.data
}
function handleGoBack() {
    router.push('/home')
}
// #endregion
</script>

<style scoped lang="less">
.loop-word-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;

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
}
</style>