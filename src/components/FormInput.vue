<template>
  <div class="form-group">
    <label 
      v-if="label" 
      :for="id" 
      class="form-label" 
      :class="{ 'required': required }"
    >
      {{ label }}
    </label>
    
    <div v-if="type === 'textarea'">
      <textarea
        :id="id"
        v-model="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        :rows="rows"
        class="form-input"
        :class="{ 'error': error }"
        v-bind="$attrs"
        @input="updateValue"
      ></textarea>
    </div>
    
    <div v-else>
      <input
        :id="id"
        :type="type"
        v-model="inputValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="form-input"
        :class="{ 'error': error }"
        v-bind="$attrs"
        @input="updateValue"
      >
    </div>
    
    <p v-if="helperText" class="form-helper">{{ helperText }}</p>
    <p v-if="error" class="form-error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

interface Props {
  modelValue: string | number
  id: string
  label?: string
  type?: 'text' | 'email' | 'password' | 'number' | 'textarea'
  placeholder?: string
  helperText?: string
  error?: string
  disabled?: boolean
  required?: boolean
  rows?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: '',
  disabled: false,
  required: false,
  rows: 4
})

const emit = defineEmits(['update:modelValue'])

const inputValue = ref(props.modelValue)

// Watch for external changes to modelValue
watch(() => props.modelValue, (newValue) => {
  inputValue.value = newValue
})

// Emit changes to parent
function updateValue() {
  emit('update:modelValue', inputValue.value)
}
</script>

<style scoped>
/* All styles are imported from global forms.css */
</style>
