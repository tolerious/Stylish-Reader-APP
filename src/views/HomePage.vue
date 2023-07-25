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
            
        </div>

    </div>
</template>

<script setup lang="ts">

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
}
</style>