<template>
  <a-form
    :model="formState"
    layout="vertical"
    @finish="handleSubmit"
    :rules="rules"
  >
    <a-form-item label="Event Name" name="name">
      <a-input v-model:value="formState.name" placeholder="Enter event name" size="large" />
    </a-form-item>

    <a-form-item label="Date" name="date">
      <a-date-picker
        v-model:value="formState.date"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        style="width: 100%"
        size="large"
      />
    </a-form-item>

    <a-form-item label="Location" name="location">
      <a-input v-model:value="formState.location" placeholder="Enter event location" size="large" />
    </a-form-item>

    <a-form-item label="Status" name="status">
      <a-select v-model:value="formState.status" size="large" placeholder="Select status">
        <a-select-option value="draft">Draft</a-select-option>
        <a-select-option value="active">Active</a-select-option>
        <a-select-option value="completed">Completed</a-select-option>
      </a-select>
    </a-form-item>

    <a-form-item label="Event Image">
      <a-upload
        :file-list="fileList"
        :before-upload="beforeUpload"
        @remove="removeFile"
        list-type="picture"
        max-count="1"
        accept="image/*"
      >
        <a-button size="large">
          <UploadOutlined /> Select Image
        </a-button>
      </a-upload>
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit" :loading="isLoading" size="large">
          {{ isEdit ? 'Update Event' : 'Create Event' }}
        </a-button>
        <a-button @click="handleCancel" size="large">
          Cancel
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { reactive, ref, onMounted, computed, toRaw } from 'vue';
import { useEventStore } from '../../stores/useEventStore';
import { UploadOutlined } from '@ant-design/icons-vue';
import dayjs from 'dayjs';
import { message } from 'ant-design-vue';

const props = defineProps({
  event: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const eventStore = useEventStore();
const isEdit = computed(() => !!props.event);
const isLoading = computed(() => eventStore.isLoading);
const fileList = ref([]);

const formState = reactive({
  name: '',
  date: null,
  location: '',
  status: 'draft',
});

const rules = {
  name: [{ required: true, message: 'Please enter event name' }],
  date: [{ required: true, message: 'Please select event date' }],
  location: [{ required: true, message: 'Please enter event location' }],
  status: [{ required: true, message: 'Please select event status' }],
};

onMounted(() => {
  if (props.event) {
    formState.name = props.event.name;
    formState.date = dayjs(props.event.date);
    formState.location = props.event.location;
    formState.status = props.event.status;
  }
});

const beforeUpload = (file) => {
  const isImage = file.type.startsWith('image/');
  if (!isImage) {
    message.error('You can only upload an image file!');
    return false;
  }
  const isLt5M = file.size / 1024 / 1024 < 5;
  if (!isLt5M) {
    message.error('Image must smaller than 5MB!');
    return false;
  }
  fileList.value = [file];
  return false; // Prevent auto upload
};

const removeFile = () => {
  fileList.value = [];
};

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append('name', formState.name);
  formData.append('date', formState.date.format('YYYY-MM-DD HH:mm:ss'));
  formData.append('location', formState.location);
  formData.append('status', formState.status);
  
  if (fileList.value.length > 0) {
    const file = toRaw(fileList.value[0]);
    formData.append('image', file.originFileObj || file);
  }

  if (isEdit.value) {
    await eventStore.updateEvent(props.event.id, formData);
  } else {
    await eventStore.createEvent(formData);
  }
  
  emit('submit');
};

const handleCancel = () => {
  emit('cancel');
};
</script>
