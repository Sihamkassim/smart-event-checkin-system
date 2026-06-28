<template>
  <div class="bulk-import-modal">
    <!-- Step 1: Upload File -->
    <div v-if="step === 1" class="py-6">
      <a-upload-dragger
        name="file"
        :multiple="false"
        accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
        :before-upload="handleFileUpload"
        :show-upload-list="false"
      >
        <p class="ant-upload-drag-icon">
          <InboxOutlined class="text-brand-500 text-4xl" />
        </p>
        <p class="ant-upload-text font-semibold text-slate-800">Click or drag file to this area to upload</p>
        <p class="ant-upload-hint text-slate-500">
          Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files.
          Please use .csv or .xlsx formats.
        </p>
      </a-upload-dragger>

      <div class="mt-6 bg-slate-50 p-4 rounded-lg text-sm text-slate-600">
        <strong>Expected Columns:</strong>
        <ul class="list-disc ml-5 mt-2 space-y-1">
          <li><code>Full Name</code> (Required)</li>
          <li><code>Phone</code> (Required)</li>
          <li><code>Email</code> (Optional)</li>
          <li><code>Company</code> (Optional)</li>
        </ul>
      </div>
    </div>

    <!-- Step 2: Preview -->
    <div v-else-if="step === 2" class="py-2">
      <div class="mb-4 flex justify-between items-center">
        <span class="text-sm text-slate-600">
          Found <strong>{{ parsedData.length }}</strong> valid records out of {{ totalParsed }} rows.
        </span>
        <a-button type="link" @click="step = 1">Re-upload File</a-button>
      </div>

      <a-table 
        :dataSource="parsedData.slice(0, 5)" 
        :columns="previewColumns" 
        size="small" 
        :pagination="false"
        class="border border-slate-200 rounded-lg overflow-hidden"
      >
        <template #footer v-if="parsedData.length > 5">
          <div class="text-center text-slate-500 text-sm py-2">
            And {{ parsedData.length - 5 }} more rows...
          </div>
        </template>
      </a-table>

      <div class="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
        <a-checkbox v-model:checked="sendEmails">
          <span class="font-medium text-slate-700">Send confirmation email tickets to imported visitors</span>
        </a-checkbox>
        <div class="flex gap-3 w-full sm:w-auto">
          <a-button @click="$emit('cancel')" class="flex-1 sm:flex-none">Cancel</a-button>
          <a-button type="primary" :loading="isImporting" @click="handleImport" class="flex-1 sm:flex-none">
            Import {{ parsedData.length }} Visitors
          </a-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';
import { InboxOutlined } from '@ant-design/icons-vue';
import { useVisitorStore } from '../../stores/useVisitorStore';
import * as XLSX from 'xlsx';

const props = defineProps({
  eventId: {
    type: [Number, String],
    required: true,
  },
});

const emit = defineEmits(['success', 'cancel']);
const visitorStore = useVisitorStore();

const step = ref(1);
const parsedData = ref([]);
const totalParsed = ref(0);
const isImporting = ref(false);
const sendEmails = ref(true);

const previewColumns = [
  { title: 'Full Name', dataIndex: 'full_name', key: 'full_name' },
  { title: 'Phone', dataIndex: 'phone', key: 'phone' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  { title: 'Company', dataIndex: 'company', key: 'company' },
];

const handleFileUpload = (file) => {
  const reader = new FileReader();

  reader.onload = (e) => {
    try {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      
      // Convert to JSON
      const json = XLSX.utils.sheet_to_json(worksheet, { defval: '' });
      
      totalParsed.value = json.length;

      // Map and validate
      const validRecords = [];
      
      json.forEach(row => {
        // Find keys case-insensitively or by common aliases
        const getVal = (keys) => {
          for (const k of keys) {
            const found = Object.keys(row).find(rk => rk.toLowerCase().trim() === k.toLowerCase());
            if (found && row[found]) return String(row[found]).trim();
          }
          return null;
        };

        const fullName = getVal(['full name', 'fullname', 'name']);
        const phone = getVal(['phone', 'phone number', 'mobile']);
        const email = getVal(['email', 'email address']);
        const company = getVal(['company', 'organization', 'org']);

        if (fullName && phone) {
          validRecords.push({
            full_name: fullName,
            phone: phone,
            email: email || undefined,
            company: company || undefined
          });
        }
      });

      if (validRecords.length === 0) {
        message.error('Could not find valid records. Please ensure columns "Full Name" and "Phone" exist.');
        return;
      }

      parsedData.value = validRecords;
      step.value = 2;
    } catch (err) {
      console.error('File parsing error', err);
      message.error('Failed to parse file. Please make sure it is a valid CSV or Excel file.');
    }
  };

  reader.readAsArrayBuffer(file);
  return false; // Prevent automatic upload
};

const handleImport = async () => {
  if (!parsedData.value.length) return;
  
  isImporting.value = true;
  const result = await visitorStore.bulkCreateVisitors(props.eventId, parsedData.value, sendEmails.value);
  isImporting.value = false;
  
  if (result.success) {
    emit('success');
    step.value = 1;
    parsedData.value = [];
  } else {
    message.error('Bulk import failed. Please try again.');
  }
};
</script>
