<template>
    <Header title="Word List" @goBack="handleGoBack" />
    <div class="loop-word-container">
        <div v-if="wordList.length > 0" class="loop-word-item" @click="visitWordDetail(word)" v-for="word in wordList">
            <div class="loop-word-left">
                <div>{{ word.wordDetail[0].name }}</div>
            </div>
            <div class="loop-word-right">
                <button v-if="addWordVisible" @click.stop="deleteWord(word._id)">
                    <span>Delete</span>
                </button>
                <button @click.stop="playAudio(word.wordDetail[0].name)">
                    <span>Audio</span>
                </button>

            </div>
        </div>
        <template v-else>
            <el-empty description="No Words." />
        </template>
        <div class="bottom-btn-group">
            <el-button type="primary" v-if="addWordVisible" @click="addWord">Add Word</el-button>
        </div>
        <audio id="wordListAudio" type="audio/mpeg" :src="audioUrl"></audio>
        <el-dialog @close="handleDialogClose" v-model="centerDialogVisible" :title="currentWord.wordDetail[0].name"
            style="max-height:85vh;overflow: scroll;" width="90%" align-center>
            <el-collapse v-model="activeNames">
                <el-collapse-item :title="`${card.name} - ${card.property} - ${card.phonetic}`" :name="index"
                    v-for="card, index in currentWord.wordDetail">
                    <div class="collapse-header">{{ card.property }} {{ card.phonetic }}</div>
                    <template v-for="dsenseObj in card.dsenseObjList">
                        <el-card style="margin-bottom: 15px;" v-for="dsense in dsenseObj.defBlockObjList">
                            <template #header>
                                <div class="dsense-title-container">{{ dsense.en }}</div>
                                <div class="dsense-title-container">{{ dsense.zh }}</div>
                            </template>
                            <div>
                                <div v-for="sentence in dsense.sentence">
                                    {{ sentence }}
                                </div>
                            </div>
                        </el-card>
                        <el-card style="margin-bottom: 15px;" v-for="dsense in dsenseObj.phraseBlockObjList">
                            <template #header>
                                <div class="dsense-title-container">{{ dsense.en }}</div>
                                <div class="dsense-title-container">{{ dsense.zh }}</div>
                            </template>
                            <div>
                                <div v-for="sentence in dsense.sentence">
                                    {{ sentence }}
                                </div>
                            </div>
                        </el-card>
                    </template>
                </el-collapse-item>
            </el-collapse>
            <!-- <template #footer>
                <span class="dialog-footer">
                    <el-button @click="centerDialogVisible = false">Cancel</el-button>
                    <el-button type="primary" @click="centerDialogVisible = false">
                        Confirm
                    </el-button>
                </span>
            </template> -->
        </el-dialog>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { request } from '@/utils/service';
import { ElMessageBox, ElNotification } from 'element-plus';
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// #region variable
let addWordVisible = ref(true)
const router = useRouter()
const route = useRoute()
let activeNames = ref([])
let wordList = ref([])
let groupID = ref('')
let originUrl = ref('https://dict.youdao.com/dictvoice?type=1&audio=')
let audioUrl = ref('https://dict.youdao.com/dictvoice?type=1&audio=')
let centerDialogVisible = ref(false)
let currentWord = ref({ wordDetail: [{ name: '' }] })
// #endregion


// #region function

async function getGroupBelongs2Me() {
    const info = await request({ url: '/wordgroup/child', })
    let a = info.data.map(item => item._id)
    if (a.indexOf(groupID.value) > -1) {
        // 当前分享的词组属于我
        addWordVisible.value = true
    } else {
        addWordVisible.value = false
    }
}

function handleDialogClose() {
    activeNames = []
}
function playAudio(word) {
    if (!word) {
        ElMessage({ message: 'Please input word first', type: 'warning', duration: 1200 });
        return
    }
    let audio = document.getElementById('wordListAudio')
    audioUrl.value = originUrl.value + word
    setTimeout(() => {
        audio.play()
    }, 300);
}
function addWord() {
    router.push('/record-word')
}
function visitWordDetail(w) {
    currentWord.value = w
    centerDialogVisible.value = true
}
async function deleteWord(id) {
    ElMessageBox.confirm('Do you want to delete this word?', 'Delete Word').then(async () => {
        const info = await request({ url: '/word', method: 'delete', data: { id: id, groupID: groupID.value } })
        if (info.code === 200) {
            ElNotification({ message: 'Delete Successfully', type: 'success', duration: 800 })
            getWordList(groupID.value)
        }
    }).catch(() => {

    })

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
onMounted(async () => {
    groupID.value = route.params.groupID
    await getGroupBelongs2Me()
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
    margin-top: 15px;
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
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: space-around;

            button {
                margin: 0;
                background-color: #eeeeee;
                padding: 3px 5px;
                border-radius: 3px;
                width: 70px;
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
    }
}
</style>