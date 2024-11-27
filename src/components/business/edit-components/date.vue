<script lang="ts" setup>
import dayjs from '@/utils/dayjs';
import { formatDate } from '@/utils/format';

type Props = {
  modelValue?: Common.NormalizedField.Date;
  //有效值 year、month、day，表示选择器的粒度，默认为 day
  fields?: 'month' | 'year' | 'day';
  triggerClass?: string;
};

type Emits = {
  (e: 'update:modelValue', date: Common.NormalizedField.Date): void;
};

const props = withDefaults(defineProps<Props>(), {
  fields: 'day'
});

const emits = defineEmits<Emits>();

const format = computed(() => {
  switch (props.fields) {
    case 'year':
      return 'YYYY';
    case 'month':
      return 'YYYY-MM';
    case 'day':
      return 'YYYY-MM-DD';
  }
});

function bindDateChange(e: any) {
  const date = dayjs(e.detail.value);
  const iso = date.format();
  const year = date.year();
  const day = date.day();
  const month = date.month();
  emits('update:modelValue', {
    iso,
    day,
    year,
    month
  });
}
</script>

<template>
  <picker mode="date" :value="formatDate(modelValue?.iso, format)" @change="bindDateChange" :fields="props.fields">
    <view class="flex items-center" :class="triggerClass">
      <text v-if="props.modelValue?.iso">{{ formatDate(props.modelValue?.iso, format) }}</text>
      <text v-else class="text-gray-300">请选择时间</text>
      <uni-icons type="forward" color="#E1E1E3"></uni-icons>
    </view>
  </picker>
</template>
