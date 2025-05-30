<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMealsStore } from '@/stores/meals'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const router = useRouter()
const mealsStore = useMealsStore()
const authStore = useAuthStore()

const name = ref('')
const description = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

// New: store selected image file
const imageFile = ref<File | null>(null)
const imagePreviewUrl = ref<string | null>(null)
const isDragOver = ref(false)
const uploadProgress = ref(0)
const fileInputRef = ref<HTMLInputElement | null>(null)

function triggerFileInput() {
  fileInputRef.value?.click();
}
function onDragOver() {
  isDragOver.value = true;
}
function onDragLeave() {
  isDragOver.value = false;
}
function onDrop(event: DragEvent) {
  isDragOver.value = false;
  const files = event.dataTransfer?.files;
  if (files && files.length > 0) {
    // Manually trigger the same validation/preview as input
    handleImageChange({ target: { files } } as unknown as Event);
  }
}


function removePreviewImage() {
  imageFile.value = null;
  imagePreviewUrl.value = null;
  // Also clear the file input value
  const fileInput = document.getElementById('image') as HTMLInputElement | null;
  if (fileInput) fileInput.value = '';
}

function handleImageChange(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files && target.files.length > 0 ? target.files[0] : null;

  // Validation
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 2 * 1024 * 1024; // 2MB

  if (file) {
    if (!allowedTypes.includes(file.type)) {
      error.value = 'Invalid file type. Only JPEG, PNG, and WEBP are allowed.';
      imageFile.value = null;
      imagePreviewUrl.value = null;
      target.value = '';
      return;
    }
    if (file.size > maxSize) {
      error.value = 'Image is too large. Maximum size is 2MB.';
      imageFile.value = null;
      imagePreviewUrl.value = null;
      target.value = '';
      return;
    }
    imageFile.value = file;
    error.value = null;
    // Preview
    const reader = new FileReader();
    reader.onload = e => {
      imagePreviewUrl.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  } else {
    imageFile.value = null;
    imagePreviewUrl.value = null;
  }
}


async function handleSubmit() {
  if (!name.value.trim()) {
    error.value = 'Name is required'
    return
  }

  loading.value = true
  error.value = null

  try {
    let imageUrl: string | null = null

    // Upload image if selected
    if (imageFile.value) {
      // Get user id for unique path
      let userId = authStore.user?.id
      if (!userId) {
        // Try to get user from supabase directly if not in store
        const { data: { user } } = await supabase.auth.getUser()
        userId = user?.id
      }
      if (!userId) throw new Error('User must be logged in to upload images')
      const timestamp = Date.now()
      const filePath = `${userId}/${timestamp}-${imageFile.value.name}`
      // Direct upload to Supabase Storage using XMLHttpRequest
      uploadProgress.value = 0;
      // Get the Supabase access token
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) throw sessionError;
      const accessToken = sessionData?.session?.access_token;
      if (!accessToken) throw new Error('Could not get Supabase access token');

      // Build upload URL
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
      if (!supabaseUrl) throw new Error('Missing Supabase URL');
      const uploadUrl = `${supabaseUrl}/storage/v1/object/meal-images/${encodeURIComponent(filePath)}`;

      // Do the upload
      const xhr = new XMLHttpRequest();
      xhr.open('POST', uploadUrl);
      xhr.setRequestHeader('Authorization', `Bearer ${accessToken}`);
      xhr.setRequestHeader('x-upsert', 'true'); // Overwrite if exists
      xhr.upload.onprogress = (event: ProgressEvent) => {
        if (event.lengthComputable) {
          uploadProgress.value = Math.round((event.loaded / event.total) * 100);
        }
      };
      const uploadPromise: Promise<void> = new Promise((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            resolve();
          } else {
            reject(new Error(`Upload failed: ${xhr.status} ${xhr.statusText} - ${xhr.responseText}`));
          }
        };
        xhr.onerror = () => {
          reject(new Error('Network error during image upload'));
        };
      });
      xhr.send(imageFile.value);
      await uploadPromise;
      uploadProgress.value = 100;
      // Get public URL
      const { data } = supabase.storage.from('meal-images').getPublicUrl(filePath);
      imageUrl = data?.publicUrl || null;
    }

    const result = await mealsStore.createMeal({
      name: name.value.trim(),
      description: description.value.trim() || null,
      image_url: imageUrl
    })

    if (!result.success) {
      throw new Error(result.error)
    }

    router.push('/')
  } catch (e) {
    error.value = (e as Error).message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="create-meal">
    <h1>Add New Meal</h1>

    <form @submit.prevent="handleSubmit" class="meal-form">
      <div class="form-group">
        <label for="name">Name</label>
        <input
          id="name"
          v-model="name"
          type="text"
          required
          placeholder="Enter meal name"
          :disabled="loading"
        >
      </div>

      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="description"
          placeholder="Enter meal description"
          rows="4"
          :disabled="loading"
        ></textarea>
      </div>

      <div v-if="error" class="error">
        {{ error }}
      </div>

      <!-- New: Meal Image Drag-and-Drop Uploader -->
      <div class="form-group">
        <label for="image">Meal Image</label>
        <div
          class="drag-drop-area"
          :class="{ 'drag-over': isDragOver }"
          @click="triggerFileInput"
          @dragover.prevent="onDragOver"
          @dragleave.prevent="onDragLeave"
          @drop.prevent="onDrop"
          tabindex="0"
          @keydown.enter.prevent="triggerFileInput"
        >
          <span v-if="!imagePreviewUrl">Drag & drop an image here, or click to select</span>
          <div v-if="imagePreviewUrl" class="image-preview-wrapper">
            <img :src="imagePreviewUrl" alt="Image preview" class="image-preview" />
            <button type="button" class="remove-preview-btn" @click.stop="removePreviewImage" aria-label="Remove image preview">✕</button>
          </div>
        </div>
        <input
          id="image"
          ref="fileInputRef"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          @change="handleImageChange"
          :disabled="loading"
          style="display: none;"
        />
        <div v-if="uploadProgress > 0 && loading" class="progress-bar-container">
          <div class="progress-bar" :style="{ width: uploadProgress + '%' }"></div>
        </div>
      </div>


      <button type="submit" :disabled="loading">
        <LoadingSpinner v-if="loading" />
        <span v-else>Add Meal</span>
      </button>
    </form>
  </div>
</template>

<style src="../components/ImagePreview.css" scoped></style>
<style src="../components/ImagePreview.css" scoped></style>
<style scoped>
.drag-drop-area {
  border: 2px dashed #a3a3a3;
  border-radius: 8px;
  padding: 1.25rem;
  text-align: center;
  color: #64748b;
  background: #f8fafc;
  cursor: pointer;
  margin-bottom: 0.5rem;
  transition: border-color 0.2s, background 0.2s;
  outline: none;
}
.drag-drop-area.drag-over,
.drag-drop-area:focus {
  border-color: #2563eb;
  background: #e0e7ff;
  color: #1e293b;
}
.progress-bar-container {
  width: 100%;
  background: #e5e7eb;
  border-radius: 6px;
  margin-top: 0.5rem;
  height: 8px;
  overflow: hidden;
}
.progress-bar {
  height: 100%;
  background: #2563eb;
  transition: width 0.2s;
}

.create-meal {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  text-align: center;
}

.meal-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

label {
  font-weight: 600;
}

textarea {
  resize: vertical;
  min-height: 100px;
}

.error {
  color: #dc2626;
  font-size: 0.875rem;
}

button {
  padding: 0.75rem 1.5rem;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

button:hover:not(:disabled) {
  background-color: #1d4ed8;
}
</style>
