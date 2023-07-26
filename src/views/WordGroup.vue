<template>
    <Header :title="'Words Group'" />
    <div class="loop-word-container">
        <div class="loop-word-item" v-for="item in 51">
            <div class="loop-word-left">
                <div class="loop-word-left-top">Everything Around You.</div>
                <div class="loop-word-left-bottom">399 words</div>
            </div>
            <div class="loop-word-right">
                <button>
                    <span>Burning</span>
                </button>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import Header from '@/components/Header.vue'

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