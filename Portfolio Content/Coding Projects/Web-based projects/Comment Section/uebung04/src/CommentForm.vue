<script setup lang="ts">
import {ref} from "vue";
import {CommentItem} from "@/types.ts";

const emit = defineEmits<{
  (e: 'add', comment: CommentItem):void;
}>();

const Name = ref('');
const Message = ref('');

function onSubmit() {
  const trName = Name.value.trim();
  const trMessage = Message.value.trim();
  if (!trMessage || !trName) return;

  const NewComment: CommentItem = {
    name: trName,
    message: trMessage,
    date: new Date().toLocaleString()
  }

  emit('add', NewComment); //is it necessary

  Name.value = '';
  Message.value = '';
}

</script>

<template>
  <div id="inputs">
    <label for="Name">Name</label>
    <input type="text" id="Name" name="Name" placeholder="Your Name..." v-model="Name">
    <label for="Comment">Message</label>
    <textarea id="Comment" name="Comment" placeholder="Your Comment..." v-model="Message"></textarea>
  </div>
  <button @click="onSubmit">Send Comment</button>
</template>

<style scoped>
#Name {
  display: flex;
  min-width: 75vw;
  flex-direction: column;
  gap: 10px;
  min-height: 2rem;
}
#Comment {
  display: flex;
  flex-direction: column;
  min-width: 75vw;
  gap: 10px;
  min-height: 4rem;
}
input, textarea {
  font-family: Helvetica, "system-ui";
  border: 1px solid #979797;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 5px;
  justify-self: center;
}
input:hover, textarea:hover{
  transform: scale(1.05);
  border: 1px solid #2d8f84;
}
button{
  font-family: Helvetica, "system-ui";
  border: 1px solid;
  border-radius: 10px;
  padding: 0.8rem;
  background-color: #111111;
  color: #ececec;
}
button:hover{
  background-color: #2d8f84;
  transform: scale(1.1);
}
#inputs {
  justify-self: center;
}
label {
  margin: 5px;
  color: #979797;
}
</style>