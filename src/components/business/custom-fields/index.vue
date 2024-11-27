<script lang="ts">
export default { name: 'CustomFields', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import { useRequest } from '@/hooks/useRequest';
import { customFieldsService } from '@/services/custom-field';
import { formatDate, formatDateRange, formatLocation, formatStringArray } from '@/utils/format';
import { isEmpty } from 'lodash-es';
import Files from '@/components/business/other/files.vue';
import { useRouter } from '@/hooks/useRouter';
import UserBasicInfo from '@/components/business/user/user-basic-info.vue';
import { generateUrl } from '@/utils/common';
import { useAuthStore } from '@/stores';

type Props = {
  modelValue?: Record<string, unknown>;
  projectId: string;
  taskId: string;
};
const props = defineProps<Props>();

const { response: schema } = useRequest(() => customFieldsService.query('Project', props.projectId));

const schemaSortOrderKeys = computed(() =>
  Object.entries(schema.value?.properties || {})
    .sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0))
    .map(([key]) => key)
);

const innerData = ref<Record<string, any>>({});

watchEffect(() => {
  innerData.value = props.modelValue ?? {};
});

function renderTextFiled(type: SchemaModel.SchemaFieldType | undefined, fieldKey: string) {
  console.log('renderTextFiled', innerData.value[fieldKey]);
  switch (type) {
    case 'Date':
      return formatDate(innerData.value[fieldKey]);
    case 'DateRange':
      return formatDateRange(innerData.value[fieldKey]);
    case 'Location':
      return formatLocation(innerData.value[fieldKey]);
    case 'NumberArray':
    case 'StringArray':
    case 'MultiChoice':
      return formatStringArray(innerData.value[fieldKey]);
    case 'Progress':
      return innerData.value[fieldKey] ? `${innerData.value[fieldKey]}%` : '';
    default:
      return innerData.value[fieldKey];
  }
}

const router = useRouter();
const authStore = useAuthStore();
function openEditor() {
  router.push('/packages/common/web-view', {
    query: {
      url: generateUrl(import.meta.env.VITE_API_URL + '/channel/task/' + props.taskId + '/custom-fields', {
        projectId: props.projectId,

        token: authStore.token
      }),
      title: ''
    }
  });
}
</script>

<template>
  <view v-if="schema?.properties && !isEmpty(schema.properties)" class="custom-fields-container">
    <view class="items">
      <view v-for="fieldKey in schemaSortOrderKeys" :key="fieldKey" class="item" @click="openEditor">
        <view class="label">{{ schema.properties[fieldKey].description }}</view>
        <view class="flex-1 line-clamp-3">
          <template v-if="schema.properties[fieldKey].web_type === 'Rating'">
            <uni-rate :value="innerData[fieldKey]?.value" :max="innerData[fieldKey]?.max" size="16" />
          </template>

          <template v-else-if="schema.properties[fieldKey].web_type === 'File'">
            <Files v-if="innerData[fieldKey]" :files="innerData[fieldKey]" :column="4" :maxDisplayCount="4" readonly />
          </template>

          <template v-else-if="schema.properties[fieldKey].web_type === 'EntityReference'">
            <view v-if="innerData[fieldKey]?.[0].entityType === 'TenantMember'" class="flex flex-wrap items-center gap-2">
              <view v-for="item in innerData[fieldKey]" :key="item.openId">
                <UserBasicInfo :user-id="item.openId" />
              </view>
            </view>
            <template v-else>
              <view v-for="item in innerData[fieldKey]" :key="item.openId">
                {{ item.openId }}
              </view>
            </template>
          </template>

          <template v-else>
            {{ renderTextFiled(schema.properties[fieldKey].web_type, fieldKey) }}
          </template>
        </view>
        <view class="flex-shrink-0">
          <uni-icons type="right" class="m-icon text-gray-400" />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.custom-fields-container {
  @apply w-full  rounded-md bg-white text-xs;
  .items {
    @apply rounded-xl;
    background: #f7f8fa;
    .item {
      @apply px-3 flex justify-between gap-2 items-center text-gray-600 text-xs;
      min-height: 40px;
      .label {
        width: 70px;
        flex-shrink: 0;
      }
      &:not(:last-child) {
        border-bottom: 1px solid #e9eae9a3;
      }
    }
  }
}
</style>
