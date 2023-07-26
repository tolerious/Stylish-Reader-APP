<template>
    <div class="homepage-container">
        <div class="slider-container">
            <el-carousel height="auto">
                <el-carousel-item style="height:180px">
                    <img src='@/assets/images/slider-01.jpg' alt="" srcset="">
                </el-carousel-item>
                <el-carousel-item>
                    <img src='@/assets/images/slider-02.jpg' alt="" srcset="">
                </el-carousel-item>
                <el-carousel-item>
                    <img src='@/assets/images/slider-03.jpg' alt="" srcset="">
                </el-carousel-item>
            </el-carousel>
        </div>
        <div class="body-container">
            <el-row justify="space-around">
                <el-col :span="11"> <el-card shadow="always" @click="redirect('recite')"> Recite Words </el-card>
                </el-col>
                <el-col :span="11"> <el-card shadow="always" @click="redirect('group')">
                        Word Group</el-card>
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
    if (condition === 'group') router.push('/group')
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
    }

    .body-container {
        margin-top: 15px;
    }
}
</style>