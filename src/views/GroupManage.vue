<template>
    <Header title="我的词组" @go-back="handleGoBack" />
    <div class="px-4 mt-4" v-if="groupList.length > 0">
        <div
            @click="redirectReciteWord(group._id)"
            v-for="group in groupList"
            :key="group._id"
            word-group
            class="rounded-sm px-2 py-1 m-2 shadow-md shadow-slate-300"
        >
            <div>{{ group.name }}</div>
            <div class="text-gray-500">收藏单词数: {{ group.wordCount }}</div>
        </div>
    </div>
    <el-empty description="No Data." v-else />
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue';
import { request } from '@/utils/service';
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const groupList = ref([]);

onMounted(async () => {
    getGroupList();
});

async function getGroupList() {
    const info = await request({
        url: '/wordgroup',
    });
    const list = info.data.list.filter(group => group.wordCount > 0);
    groupList.value = list;
}

function handleGoBack() {
    router.push('/home');
}

function redirectReciteWord(groupId: string) {
    router.push(`/recite/${groupId}`);
}
</script>

<style scoped lang="less">
.group-manage-container {
    width: 90%;
    margin: 0 auto 40px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    margin-top: 15px;

    .loop-word-item {
        min-height: 65px;
        border: 1px solid #eeeeee;
        box-shadow: 2px 2px 2px #eeeeee;
        width: 100%;
        border-radius: 5px;
        margin-bottom: 10px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        padding: 0 5px;

        .loop-word-left {
            width: 45%;
            height: 100%;
            font-size: 14px;

            .loop-word-left-top {
                height: 60%;
                color: #333;
            }

            .loop-word-left-bottom {
                height: 40%;
                color: grey;
            }
        }

        .loop-word-right {
            width: 160px;
            height: 100%;
            line-height: 60px;
            text-align: center;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-around;

            &-left,
            &-right {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: space-around;
                height: 100%;

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
