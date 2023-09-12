<template>
    <Header title="good" @go-back="handleGoBack"></Header>
    <div class="relearn-container" v-if="relearnVisible">
        <el-card shadow="always"> Always </el-card>
        <el-card shadow="always"> Always </el-card>
    </div>
    <div class="review-word-container" v-if="realWordList.length > 0 && !relearnVisible">
        <div class="review-word-container-inner">
            <div class="review-word-container-inner-title">
                {{ currentPos }} <span>{{ currentWord.enName }}</span>
            </div>
            <div class="review-word-container-inner-body">
                <div class="review-word-container-inner-body-item" v-for="word in realWordList" :key="word.cnName">
                    <el-radio :label="word.uuid" v-model="answer" class="radio-class">
                        <span>{{ word.cnName }}</span>
                    </el-radio>
                </div>
                <div class="btn-group">
                    <template v-if="!resultVisible">
                        <template v-if="currentPos === wordList.length - 1">
                            <el-button type="warning" @click="handleClick('prev')">Prev</el-button>
                            <el-button type="primary" @click="handleClick('submit')">Submit</el-button>
                        </template>
                        <template v-else>
                            <el-button v-if="currentPos != 0" type="warning" @click="handleClick('prev')"
                                >Prev</el-button
                            >
                            <el-button type="primary" @click="handleClick('next')">Next</el-button>
                        </template>
                    </template>
                    <template v-else>
                        <el-button type="primary" @click="handleClick('relearn')">Learn Incorrect Words</el-button>
                    </template>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { request } from '@/utils/service';
import { ElNotification } from 'element-plus';
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { v4 as uuidv4 } from 'uuid';

// #region variable
const router = useRouter();
const route = useRoute();
const answer = ref('');
const choiceList = ref([1, 2, 3, 4]);
const groupID = ref('');
let wordList = ref([]);
let realWordList = ref([]);
let allExamList = ref([]);
let currentWord = ref('');
let currentPos = ref(0);
let customerChoiceObj = ref({});
let resultVisible = ref(false);
let relearnVisible = ref(true);
let incorrectAnswerList = ref([]);
// #endregion

// #region lifecycle
onMounted(() => {
    groupID.value = route.params.groupID as string;
    getWordList(groupID.value);
});
// #endregion

// #region function

const renderResultData = () => {
    resultVisible.value = true;
};

const generateCorrectAnswerList = () => {
    let t = wordList.value.map((item, index) => {
        return {
            [index]: item.uuid,
        };
    });
    return t;
};

const correctAnswer = () => {
    let correct = 0;
    let wrong = 0;
    let t = generateCorrectAnswerList();
    console.error('correct answer:');
    console.log(t);
    t.forEach((item, index) => {
        if (item[index] === customerChoiceObj.value[index]) {
            allExamList.value[index].isCorrect = true;
            correct++;
        } else {
            wrong++;
        }
    });
    return [correct, wrong];
};

const handleClick = (params: string) => {
    switch (params) {
        case 'prev':
            if (currentPos.value > 0) {
                currentPos.value--;
                realWordList.value = allExamList.value[currentPos.value].list;
            }
            answer.value = customerChoiceObj.value[currentPos.value];
            currentWord.value = allExamList.value[currentPos.value];
            break;
        case 'next':
            if (!answer.value) {
                ElNotification({ type: 'warning', message: 'Not choose the answer.' });
                return;
            }
            customerChoiceObj.value[currentPos.value] = answer.value.toString();
            if (currentPos.value < wordList.value.length - 1) {
                currentPos.value++;
                // realWordList.value = generateWordList(currentPos.value);
                realWordList.value = allExamList.value[currentPos.value].list;
                currentWord.value = allExamList.value[currentPos.value];
            }
            answer.value = '';
            break;
        case 'submit':
            customerChoiceObj.value[currentPos.value] = answer.value;
            console.error('customer choice:');
            console.log(customerChoiceObj.value);
            let [right, wrong] = correctAnswer();
            ElNotification({
                type: 'info',
                duration: 5000,
                message: `Testing Result: Correct: ${right}, Error: ${wrong}`,
            });
            renderResultData();
            break;
        case 'relearn':
            relearnVisible = true;
            break;
        default:
            break;
    }
};
const handleGoBack = () => {
    router.go(-1);
};

const generateAllExamList = () => {
    wordList.value.forEach((item, index) => {
        allExamList.value.push({
            isCorrect: true,
            uuid: item.uuid,
            enName: item.wordDetail[0].name,
            list: generateWordList(index),
        });
    });
};

function getRandomArrayElements(arr, count) {
    var shuffled = arr.slice(0),
        i = arr.length,
        min = i - count,
        temp,
        index; //只是声明变量的方式, 也可以分开写
    while (i-- > min) {
        //console.log(i);
        index = Math.floor((i + 1) * Math.random()); //这里的+1 是因为上面i--的操作  所以要加回来
        temp = shuffled[index]; //即值交换
        shuffled[index] = shuffled[i];
        shuffled[i] = temp;
        //console.log(shuffled);
    }
    return shuffled.slice(min);
}

function generateArray(count) {
    let a = new Array();
    for (var i = 0; i < count; i++) {
        a.push(i);
    }
    return a;
}

function generateArrayNumber(pos, length, arrayLength) {
    let a = generateArray(length);
    let ge = getRandomArrayElements(a, arrayLength);
    // console.log(`First generate: ${ge}`);
    while (ge.indexOf(pos) > -1) {
        ge = getRandomArrayElements(a, 3);
        // console.log(`Inside generate: ${ge}`);
    }
    // console.log(`Final generate: ${ge}`);
    return ge;
}

function generateWordList(pos) {
    let wl = [];
    let wlv = wordList.value;
    wl.push({
        uuid: wlv[pos].uuid,
        enName: wlv[pos].wordDetail[0].name,
        cnName: wlv[pos].wordDetail[0].dsenseObjList[0].defBlockObjList[0].zh,
    });
    let a = generateArrayNumber(pos, wordList.value.length, 3);
    a.forEach(item => {
        wl.push({
            uuid: wlv[item].uuid,
            enName: wlv[item].wordDetail[0].name,
            cnName: wlv[item].wordDetail[0].dsenseObjList[0].defBlockObjList[0].zh,
        });
    });
    // 需要随机排列下，不然正确答案永远在第一个
    let n = generateArrayNumber(9, 4, 4);
    return n.map(item => {
        return wl[item];
    });
}

async function getWordList(groupID: string) {
    const info = await request({
        url: '/word/bygroup',
        method: 'post',
        data: { groupID: groupID },
    });
    if (info.data.length < 5) {
        ElNotification({ type: 'warning', message: 'Less than 5 words, can not start to test ' });
        return;
    }
    // 生成可以供测试的单词列表
    wordList.value = info.data.map(item => {
        return {
            ...item,
            uuid: uuidv4(),
        };
    });
    ElNotification({ type: 'success', message: `You have ${wordList.value.length} words to review.` });
    // realWordList.value = generateWordList(0);
    generateAllExamList();
    realWordList.value = allExamList.value[0].list;
    currentWord.value = allExamList.value[0];
}
// #endregion
</script>

<style scoped lang="less">
.relearn-container {
    width: 90%;
    margin: 30px auto;
    display: grid;
    grid-template-columns: 1fr;
    grid-row-gap: 15px;
}
.review-word-container {
    .error {
        color: red;
    }
    width: 95%;
    padding: 0px 3px 10px 3px;
    border: 1px solid #333333;
    border-radius: 5px;
    margin: 15px auto auto auto;
    box-sizing: border-box;

    &-inner {
        &-title {
            color: rgb(255, 124, 10);
            font-weight: bold;
            font-size: 18px;
            text-align: center;
            height: 60px;
            line-height: 60px;
        }

        &-body {
            .error-container {
            }
            &-item:last-child {
                background-color: red;
            }

            & > &-item:first-child {
                border-top: 1px solid #333;
            }

            &-item {
                height: auto;
                max-height: 100px;
                margin-bottom: 10px;
                border-bottom: 1px solid #333;
                padding: 8px 5px;

                .radio-class {
                    text-overflow: ellipsis;
                    white-space: normal;
                    line-height: 20px;
                    font-size: 15px !important;
                    // vertical-align: middle;
                    display: inline-block;
                }
            }

            .btn-group {
                display: flex;
                flex-direction: row;
                justify-content: space-around;
                align-items: center;
                height: 60px;
            }
        }
    }
}
</style>
