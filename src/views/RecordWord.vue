<template>
    <Header :title="'Record Word'" @go-back="handleGoBack" />
    <div class="record-word-container">
        <el-form :inline="true" :model="form" label-width="80px">
            <el-form-item label="Word:">
                <el-input v-model="form.englishName"></el-input>
                <el-button style="margin-left: 15px;" type="primary" @click="searchWord">查询</el-button>
            </el-form-item>
        </el-form>
        <el-collapse v-model="activeNames">
            <el-collapse-item v-for="item, index in  form.wordDescriptionList " :key="index" :title="`Option ${index + 1}`"
                :name="index">
                <el-form :model="item" label-width="80">
                    <el-form-item label="EN">
                        <el-input v-model="item.englishDescription"></el-input>
                    </el-form-item>
                    <el-form-item label="ZH">
                        <el-input v-model="item.chineseDescription"></el-input>
                    </el-form-item>
                    <el-form-item label="Sentence">
                        <el-input v-model="item.sentence" type="textarea" :rows="5" label="Sentence"></el-input>
                    </el-form-item>
                    <el-form-item label="Level">
                        <el-select v-model="item.level">
                            <el-option label="" value=""></el-option>
                            <el-option label="A1" value="A1"></el-option>
                            <el-option label="A2" value="A2"></el-option>
                            <el-option label="B1" value="B1"></el-option>
                            <el-option label="B2" value="B2"></el-option>
                            <el-option label="C1" value="C1"></el-option>
                            <el-option label="C2" value="C2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Group">
                        <el-select v-model="defaultGroup">
                            <el-option label="" value=""></el-option>
                            <el-option v-for="group in groupList" :key="group._id" :label="group.name"
                                :value="group._id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="Property">
                        <el-select v-model="item.partOfSpeech">
                            <el-option label="" value=""></el-option>
                            <el-option label="n." value="n."></el-option>
                            <el-option label="v." value="v."></el-option>
                            <el-option label="adj." value="adj."></el-option>
                            <el-option label="adv." value="adv."></el-option>
                            <el-option label="prep." value="prep."></el-option>
                        </el-select>
                    </el-form-item>

                </el-form>
            </el-collapse-item>
        </el-collapse>
        <div class="bottom-btn-group">
            <el-button type="primary">Confirm</el-button>
            <el-button type="danger">Pronounce</el-button>
            <el-button type="warning" @click="addNewItem">New Item</el-button>
        </div>
    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'
import { onMounted, ref } from 'vue';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router';
import { request } from '@/utils/service'

// #region interface

interface WD {
    englishDescription: string,
    partOfSpeech: string,
    level: string,
    chineseDescription: string,
    sentence: string,
    group: string,
}

interface WDL {
    englishName: string,
    wordDescriptionList: WD[]
}
// #endregion

// #region variable
const router = useRouter()
const activeNames = ref(0)
let wordDescription: Ref<WD>

const form: Ref<WDL> = ref({
    englishName: '',
    wordDescriptionList: []
})
let defaultGroup = ref('')
let groupList = ref([])
// #endregion

// #region lifecycle
onMounted(() => {
    wordDescription = ref({
        englishDescription: '',
        partOfSpeech: '',
        level: '',
        chineseDescription: '',
        sentence: '',
        group: '',
    })
    form.value.wordDescriptionList.push(wordDescription.value)
    getDefaultGroup()
    getGroupList()
})
// #endregion

// #region function
async function searchWord() {
    const info = await request({
        url: '/word/grab',
        method: 'post',
        data: {
            word: form.value.englishName
        }
    })
    console.log(info.data);
    
}

function addNewItem() {
    wordDescription = ref({
        englishDescription: '',
        partOfSpeech: '',
        level: '',
        chineseDescription: '',
        sentence: '',
        group: '',
    })
    form.value.wordDescriptionList.push(wordDescription.value)
}
function handleGoBack() {
    router.push('/')
}
async function getGroupList() {
    const info = await request({
        url: '/wordgroup'
    })
    groupList.value = info.data
}
async function getDefaultGroup() {
    const info = await request({
        url: '/usersetting', method: 'post'
    })
    defaultGroup.value = info.data.defaultGroupID
}
// #endregion
</script>

<style scoped lang="less">
.record-word-container {
    width: 90%;
    margin: 0 auto 50px auto;

    .bottom-btn-group {
        height: 30px;
        position: fixed;
        bottom: 15px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 90%;
    }


}
</style>