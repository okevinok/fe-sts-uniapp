<script lang="ts" setup>
import { pull } from 'lodash-es';

type Props = {
  modelValue?: string[];
  data?: string[];
  readonly?: boolean;
  isSingle?: boolean;
};

type Emits = {
  (e: 'update:model-value', value: Props['modelValue']): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

function handleSelect(tag: string) {
  if (props.readonly) return;

  const isIncluded = props.modelValue?.includes(tag);

  if (props.isSingle) {
    emits('update:model-value', isIncluded ? [] : [tag]);
  } else {
    const tags = isIncluded ? pull([...(props.modelValue || [])], tag) : [...(props.modelValue ?? []), tag];
    emits('update:model-value', tags);
  }
}

const tags = computed(() => (props.readonly ? props.modelValue : props.data));
</script>

<template>
  <view class="tags">
    <view
      class="tags-item"
      v-for="tag in tags"
      :key="tag"
      :class="{
        active: modelValue?.includes(tag) && !props.readonly
      }"
      @click="handleSelect(tag)"
    >
      {{ tag }}
    </view>
  </view>
</template>

<style lang="scss" scoped>
.tags {
  display: block;
  &-item {
    @apply items-center px-4 py-2 rounded-full mr-3 mb-3 text-13px inline-flex;
    background-color: #f2f2f3;
    color: $uni-color-primary;
    &.active {
      background-color: $uni-color-primary;
      color: white;
    }
  }
}
</style>
