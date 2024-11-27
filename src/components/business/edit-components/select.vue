<script lang="ts" setup>
import Display from './field-display.vue';
import { isEqual } from 'lodash-es';

/** 页面route参数需要从props中获取 */
type Props = {
  modelValue: any;
  title?: string;
  subTitle?: string;
  placeholder?: string;
  data: { label: string; value: any }[];
  isArray?: boolean;
};

type Emits = {
  (e: 'update:modelValue', value: Props['modelValue']): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const popupRef = ref();

function handleOpenPopup() {
  popupRef.value?.open();
}

function close() {
  popupRef.value?.close();
}

function handleSelect(value: Props['modelValue']) {
  emits('update:modelValue', props.isArray ? [value] : value);
  close();
}

const selectedType = computed(() => {
  return props.data.find((type) => {
    return isEqual(type.value, props.isArray ? props.modelValue[0] : props.modelValue);
  });
});
</script>

<template>
  <view class="select-wrapper" @click="handleOpenPopup">
    <Display :model-value="selectedType?.label" :placeholder="placeholder" />

    <uni-popup ref="popupRef" type="bottom" :safeArea="false">
      <view class="popper">
        <!-- 标题 -->
        <view class="flex justify-between items-start mb-12px" @click.stop>
          <view class="flex flex-col gap-2">
            <view class="text-16px font-medium">{{ props.title }}</view>
            <view class="text-12px text-gray-400" v-if="props.subTitle">{{ props.subTitle }}</view>
          </view>
          <uni-icons type="closeempty" @click="close"></uni-icons>
        </view>

        <!-- 列表 -->
        <view class="flex flex-col">
          <view
            class="select-item"
            v-for="item in props.data"
            :class="selectedType === item && `selected`"
            :key="item.value"
            @tap="handleSelect(item.value)"
          >
            <view>{{ item.label }}</view>
            <uni-icons type="checkmarkempty" v-if="selectedType === item" color="#ff7d04" />
          </view>
        </view>
      </view>
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped>
.select-wrapper {
  @apply flex flex-grow justify-end items-center;
}
.select-item {
  @apply flex justify-between items-center h-50px text-16px;
  &:not(:last-child) {
    border-bottom: 0.5px solid $uni-bg-color-hover;
  }
  &.selected {
    color: $uni-color-primary;
    font-weight: 500;
  }
}

.popper {
  @apply bg-white p-5 z-9999;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
}
</style>
