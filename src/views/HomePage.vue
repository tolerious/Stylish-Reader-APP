<template>
    <div class="homepage-container">
        <div class="slider-container">
            <el-carousel height="auto">
                <el-carousel-item style="height:180px">
                    <div class="daily-word-container">
                        <div>Emotional</div>
                        <p>relating to the emotions</p>
                        <p>情绪（上）的，情感（上）的</p>
                    </div>
                </el-carousel-item>
                <el-carousel-item>
                    <!-- <img src='@/assets/images/slider-02.jpg' alt="" srcset=""> -->
                    <div class="daily-word-container">
                        <div>Emotional</div>
                        <p>relating to the emotions</p>
                        <p>情绪（上）的，情感（上）的</p>
                    </div>
                </el-carousel-item>
                <el-carousel-item>
                    <img src='@/assets/images/slider-03.jpg' alt="" srcset="">
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="body-container">
            <el-row justify="space-around">
                <el-col :span="11">
                    <el-card shadow="always" @click="redirect('group-manage')">Manage Group</el-card>
                </el-col>
                <el-col :span="11">
                    <el-card shadow="always" @click="redirect('record')">Record Word</el-card>
                </el-col>
            </el-row>
            <el-row justify="space-around" style="margin-top: 15px;">
                <el-col :span="11"> <el-card shadow="always" @click="redirect('recite')"> Flash Card </el-card>
                </el-col>
                <el-col :span="11"> <el-card shadow="always" @click="redirect('group-recite')">
                        Word List</el-card>
                </el-col>
            </el-row>
            <el-row justify="space-around" style="margin-top: 15px;">
                <el-col :span="11">
                    <el-card shadow="always" @click="redirect('cycling')">Group Cycling</el-card>
                </el-col>
                <el-col :span="11">
                    <el-card shadow="always" @click="redirect('feedback')">Feedback</el-card>
                </el-col>
            </el-row>
            <el-row justify="space-around" style="margin-top: 15px;">
                <el-col :span="11">
                    <el-card shadow="always" @click="redirect('settings')">Settings</el-card>
                </el-col>
                <el-col :span="11">
                    <el-card shadow="always" @click="redirect('help')">Help</el-card>
                </el-col>
            </el-row>
        </div>

    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter()
function redirect(condition: string) {
    if (condition === 'recite') router.push('/recite')
    if (condition === 'group-recite') router.push('/group-recite')
    if (condition == 'cycling') router.push('/cycling')
    if (condition == 'feedback') router.push('/feedback')
    if (condition == 'group-manage') router.push('/group-manage')
    if (condition == 'record') router.push('/record-word')
    if (condition == 'settings') router.push('/settings')
    if (condition == 'help') router.push('/help')
}
</script>

<style lang="less" scoped>
.homepage-container {
    .slider-container {
        height: 180px;
        background-color: grey;

        img {
            object-fit: fill;
        }

        .daily-word-container {
            padding: 3px 5px;
            background-color: rgba(0, 255, 255, 0.5);
            height: 100%;
        }
    }

    .body-container {
        margin-top: 15px;
    }
}
</style>