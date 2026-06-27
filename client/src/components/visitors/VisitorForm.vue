<template>
  <a-form
    :model="formState"
    layout="vertical"
    @finish="handleSubmit"
    :rules="rules"
  >
    <a-form-item label="Full Name" name="full_name">
      <a-input v-model:value="formState.full_name" placeholder="Enter full name" size="large" />
    </a-form-item>

    <a-form-item label="Phone" name="phone">
      <a-input v-model:value="formState.phone" placeholder="Enter phone number" size="large" />
    </a-form-item>

    <a-form-item label="Email" name="email">
      <a-input v-model:value="formState.email" placeholder="Enter email (optional)" size="large" />
    </a-form-item>

    <a-form-item label="Company" name="company">
      <a-input v-model:value="formState.company" placeholder="Enter company (optional)" size="large" />
    </a-form-item>

    <a-form-item>
      <a-space>
        <a-button type="primary" html-type="submit" :loading="isLoading" size="large">
          {{ isEdit ? 'Update Visitor' : 'Add Visitor' }}
        </a-button>
        <a-button @click="handleCancel" size="large">
          Cancel
        </a-button>
      </a-space>
    </a-form-item>
  </a-form>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue';
import { useVisitorStore } from '../../stores/useVisitorStore';

const props = defineProps({
  visitor: {
    type: Object,
    default: null,
  },
  eventId: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const visitorStore = useVisitorStore();
const isEdit = computed(() => !!props.visitor);
const isLoading = computed(() => visitorStore.isLoading);

const formState = reactive({
  full_name: '',
  phone: '',
  email: '',
  company: '',
});

const rules = {
  full_name: [{ required: true, message: 'Please enter full name' }],
  phone: [{ required: true, message: 'Please enter phone number' }],
};

onMounted(() => {
  if (props.visitor) {
    formState.full_name = props.visitor.full_name;
    formState.phone = props.visitor.phone;
    formState.email = props.visitor.email || '';
    formState.company = props.visitor.company || '';
  }
});

const handleSubmit = async () => {
  let result;
  if (isEdit.value) {
    result = await visitorStore.updateVisitor(props.visitor.id, formState);
  } else {
    result = await visitorStore.createVisitor(props.eventId, formState);
  }

  if (result.success) {
    emit('submit');
  }
};

const handleCancel = () => {
  emit('cancel');
};
</script>
