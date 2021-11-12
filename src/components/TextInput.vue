<template>
  <div class="input-group" :class="{ error }">
    <label :for="id">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      :value="value"
      @input="$emit('input', $event.target.value)"
    />
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script>
export default {
  name: 'TextInput',
  props: ['label', 'id', 'value', 'type', 'error']
}
</script>

<style>
.input-group {
  margin-right: 10px;
  display: flex;
  flex-direction: column;
}

.input-group label {
  margin-bottom: 5px;
}

.input-group input {
  border: none;
  border-bottom: 1px solid gray;
}

.error input {
  border-block-color: red;
}
</style>