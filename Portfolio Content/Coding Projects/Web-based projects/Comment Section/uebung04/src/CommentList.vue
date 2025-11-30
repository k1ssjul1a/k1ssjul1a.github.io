<script setup lang="ts">
import { ref, onMounted} from "vue";
import CommentForm from "@/CommentForm.vue";
import Comment from "@/Comment.vue";
import type {CommentItem} from "@/types.ts";

const storage_key = "comments_app_vue";

const comments = ref<CommentItem[]>([]);

function loadComments() {
  try {
    const r = localStorage.getItem(storage_key);
    if (r) comments.value = JSON.parse(r) as CommentItem[];
  } catch (e) {
    comments.value = [];
  }
}

function saveComments() {
  localStorage.setItem(storage_key, JSON.stringify(comments.value));
}

onMounted(() => loadComments());

function addComment (comment: CommentItem) {
  comments.value.unshift(comment);
  saveComments()
}

function removeComment(Index: number) {
  comments.value.splice(Index, 1);
  saveComments()
}

</script>

<template>
  <section id="commentSection">
<CommentForm @add="addComment"></CommentForm>

  <div>
    <p v-if="comments.length === 0">No comments yet...</p>

    <div v-else>
      <Comment v-for="(c, i) in comments"
               :key="i"
               :Name="c.name"
               :Message="c.message"
               :Datum="c.date"
               :Index="i"
               @removeComment="removeComment">
      </Comment>
    </div>
  </div>
  </section>
</template>

<style scoped>
#commentSection {
  justify-self: center;
}
</style>
