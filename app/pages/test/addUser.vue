<script setup lang="ts">
const nameInput = ref('');
const emailInput = ref('');

function submit() {
    $fetch("/api/addUser", {
        method: "POST",
        body: {
            name: nameInput.value,
            email: emailInput.value
        }
    })
}
</script>

<template>
    <div>
        <div class="add-user-wrapper">
            <input v-model="nameInput" type="text" placeholder="Name"><br/>
            <input v-model="emailInput" type="email" placeholder="Email"><br/>
            <button @click="submit">add</button>
        </div>
    </div>
</template>

<style>
.add-user-wrapper{
    display: flex;
    flex-direction: column;
    height: 100vh;
    align-items: center;
    justify-content: center;
}
</style>