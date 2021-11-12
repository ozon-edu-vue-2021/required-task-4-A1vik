<template>
  <div class="input">
    <label>{{ label }}</label>
    <input
      type="text"
      :list='field'
      :value="value"
      @input="$emit('input', $event.target.value)"
    >
    <datalist type="text" :id="field">
      <option
        v-for="item in items"
        :key="item.id"
      >
        {{ item[field] }}
      </option>
    </datalist>
  </div>
</template>

<script>
export default {
  props: ['label', 'value', 'items', 'field']
}
</script>

<style>

</style>