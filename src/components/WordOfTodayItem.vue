<template>
    <div
        @click="handleItemClick"
        :class="classObj"
        class="font-bold px-1 py-16 shadow-md shadow-slate-300 rounded-xs ring-1 ring-slate-300 flex justify-around items-center cursor-pointer transform duration-300 hover:bg-slate-300 hover:scale-105"
    >
        <template v-if="!hasRotated"
            ><span class="text-xl">{{ wordText }}</span></template
        >
        <template v-else
            ><div class="flex-col">
                <div class="rotate-y-180" v-for="translation in translationContent" :key="translation">
                    {{ translation.pos }} {{ translation.zh }}
                </div>
            </div></template
        >
    </div>
</template>

<script setup lang="ts">
import { request } from '@/utils/service';
import { reactive, ref } from 'vue';

const props = defineProps<{
    wordText: string;
}>();

const hasRotated = ref(false);

const classObj = reactive({
    'bg-pink-300': false,
    'rotate-y-180': false,
});

const translationContent = reactive([]);

function handleItemClick() {
    classObj['bg-pink-300'] = !classObj['bg-pink-300'];
    classObj['rotate-y-180'] = !classObj['rotate-y-180'];
    hasRotated.value = !hasRotated.value;
    getTranslation(props.wordText);
}

async function getTranslation(wordText: string) {
    const t = await request({ url: '/translation/content/', method: 'post', data: { word: wordText } });
    Object.assign(translationContent, t.data.dicList);
}
</script>
