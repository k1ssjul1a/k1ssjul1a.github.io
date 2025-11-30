<script setup lang="ts">
import Header from "@/Header.vue";
import CommentList from "@/CommentList.vue";
</script>

<template>
  <div id="main">
  <Header></Header>
  <CommentList></CommentList>
  </div>
</template>

<style scoped>
#main {
  font-family: Helvetica, "system-ui";
  padding: 18px;
  background-color: #ececec;
  color: #111111;
  justify-content: center;
}
</style>
