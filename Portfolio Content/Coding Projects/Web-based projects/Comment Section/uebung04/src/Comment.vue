<script setup lang="ts">
import {ref, computed} from "vue";

interface Props {
  Name: string;
  Message: string;
  Datum: string;
  Index: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'removeComment', Index: number): void;
}>()

const commentIndex = ref(props.Index);

const backgrClass = computed(() => (commentIndex.value % 2 === 0 ? 'even' : 'odd'))

function onRemove() {
  emit('removeComment', commentIndex.value)
}

</script>

<template>
  <article :class="['Comment', backgrClass]">
    <strong>{{ Name }}</strong>
    <p>{{ Message }}</p>
    <span id="date">{{ Datum }}</span>
    <div id="btnDiv">
      <button id="removeBtn" @click="onRemove">Remove</button>
    </div>
  </article>
</template>

<style scoped>
article {
  margin: 10px 0 10px 0;
  border: 1px solid #979797;
  border-radius: 10px;
  padding: 10px;
}
#removeBtn {
    font-family: Helvetica, "system-ui";
    border: 1px solid;
    border-radius: 10px;
    padding: 0.5rem;
    background-color: #eaeaea;
    color: #111111;
    justify-items: right;
}
#removeBtn:hover {
  background-color: #2d8f84;
  color: #ececec;
  border: 1px solid #ececec;
  transform: scale(1.1);
}
#btnDiv {
  display: flex;
  flex-wrap: wrap;
  justify-content: right;
}
.Comment.even {
  background-color: #8bcdc9;
}
.Comment.odd {
  background-color: #dcedeb;
}
#date {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row-reverse;
  margin-bottom: 10px;
}

</style>