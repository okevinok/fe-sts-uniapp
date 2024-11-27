<script lang="ts" setup>
type Props = {
  modelValue?: any;
  placeholder?: string;
  readonly?: boolean;
  isLongText?: boolean;
};
type Emits = {
  (e: 'click'): void;
};
const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const placeholderSafeList = [`不限`, `面议`];
</script>

<template>
  <view class="display" :class="props.isLongText && `long-text`" @click="emits('click')">
    <view v-if="modelValue || placeholderSafeList.includes(placeholder || '')" class="!truncate">
      {{ modelValue || placeholder }}
    </view>
    <view v-else class="!text-gray-300">{{ placeholder }}</view>
    <uni-icons v-if="!readonly" type="forward" color="#E1E1E3" />
  </view>
</template>

<style lang="scss" scoped>
.display {
  @apply w-full flex-grow justify-end text-right text-14px items-center flex truncate;
  &.long-text {
    @apply justify-start text-left w-85vw;
  }
}
</style>
