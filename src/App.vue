<script setup lang="ts">
import { RouterView } from 'vue-router'
document.documentElement.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, false);
var lastTouchEnd = 0;
document.documentElement.addEventListener('touchend', function (event) {
  var now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);
</script>

<template>
  <RouterView />
  <el-backtop :right="10" :bottom="40" />
</template>


<style lang="less" scoped></style>
