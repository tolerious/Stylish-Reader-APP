<template>
    <Header title="Word List" @goBack="handleGoBack" />
    <div class="loop-word-container">
        <div v-if="wordList.length > 0" class="loop-word-item" @click="visitWordDetail" v-for="word in wordList">
            <div class="loop-word-left">
                <div>{{ word.wordDetail[0].name }}</div>
            </div>
            <div class="loop-word-right">
                <button @click.stop="deleteWord(word._id)">
                    <span>Delete</span>
                </button>
            </div>
        </div>
        <template v-else>
            <el-empty description="No Words." />
        </template>
        <div class="bottom-btn-group">
            <el-button type="primary" @click="addWord">Add Word</el-button>
        </div>

    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { request } from '@/utils/service';
import { ElNotification } from 'element-plus';
import { onMounted, ref } from 'vue';
import { onBeforeRouteLeave, useRoute, useRouter } from 'vue-router';

// #region variable
const router = useRouter()
const route = useRoute()
let wordList = ref([])
let groupID = ref('')
// #endregion


// #region function
function addWord() {
    router.push('/record-word')
}
function visitWordDetail() {

}
async function deleteWord(id) {
    const info = await request({ url: '/word', method: 'delete', data: { id: id, groupID: groupID.value } })
    if (info.code === 200) {
        ElNotification({ message: 'Delete Successfully', type: 'success', duration: 800 })
        getWordList(groupID.value)
    }
}
function handleGoBack() {
    router.go(-1)
}
async function getWordList(groupID) {
    const info = await request({
        url: '/word/bygroup',
        method: 'post',
        data: { groupID: groupID }
    })
    wordList.value = info.data
}

// #endregion

// #region lifecycle
onMounted(() => {
    groupID.value = route.params.groupID
    getWordList(groupID.value)
})
// #endregion

</script>

<style scoped lang="less">
.loop-word-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 40px;

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
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            padding-left: 15px;
            box-sizing: border-box;
            font-size: 15px;
            font-weight: bold;
            color: #ff7c0a;

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

    .bottom-btn-group {
        text-align: center;
        height: 30px;
        position: fixed;
        bottom: 15px;
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 90%;
    }
}
</style>