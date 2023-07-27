<template>
    <Header :title="'Record Word'" @go-back="handleGoBack" />
    <div class="record-word-container">
        <el-form :model="form" label-width="120px">
            <el-form-item label="Word:">
                <el-input v-model="form.englishName"></el-input>
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
                    <el-form-item label="Sentence">
                        <el-input v-model="item.sentence" type="textarea" :rows="5" label="Sentence"></el-input>
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
import { ref } from 'vue';
import type { Ref } from 'vue';
import { useRouter } from 'vue-router';

interface WD {
    englishDescription: string,
    partOfSpeech: string,
    level: string,
    chineseDescription: string,
    sentence: string
}

interface WDL {
    englishName: string,
    wordDescriptionList: WD[]
}
// #region
const activeNames = ref(0)

let wordDescription: Ref<WD> = ref({
    englishDescription: '',
    partOfSpeech: '',
    level: '',
    chineseDescription: '',
    sentence: ''
})

const form: Ref<WDL> = ref({
    englishName: '',
    wordDescriptionList: []
})
form.value.wordDescriptionList.push(wordDescription.value)
// #endregion

// #region
function addNewItem() {
    console.log(form.value.wordDescriptionList.push(wordDescription.value));
}
function handleGoBack() {
    const router = useRouter()
    router.push('/')
}
// #endregion
</script>

<style scoped lang="less">
.record-word-container {
    width: 90%;
    margin: 0 auto;

    .bottom-btn-group {
        position: fixed;
        bottom: 15px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 90%;
    }


}
</style>