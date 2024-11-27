<script lang="ts" setup>
import { THEME_COLOR } from '@/config';

type Props = { modelValue: string[] | undefined };
type Emits = {
  (e: 'update:modelValue', value: string[]): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const model = ref<string[]>([]);
const input = ref('');
const showInput = ref(false);

function handleShowInput() {
  showInput.value = true;
}

function handleInputConfirm() {
  showInput.value = false;
  if (input.value) {
    model.value.push(input.value);
    input.value = '';
  }
}

function handleRemoveTag(index: number) {
  model.value.splice(index, 1);
}

watchEffect(() => {
  model.value = props.modelValue || [];
});

watch(
  model,
  (val) => {
    emits('update:modelValue', val);
  },
  { deep: true }
);
</script>

<template>
  <view class="flex items-center flex-wrap gap-3">
    <MTag v-for="(item, index) in model" type="primary" :key="item">
      <view class="flex items-center gap-1 justify-between">
        <span>{{ item }}</span>
        <uni-icons type="closeempty" :color="THEME_COLOR" size="14" @click="handleRemoveTag(index)" />
      </view>
    </MTag>
    <view>
      <MTag v-if="!showInput" @click="handleShowInput">+ 新文本</MTag>
      <input v-else v-model="input" :focus="showInput" type="text" class="w-80px max-w-full" @blur="handleInputConfirm" />
    </view>
  </view>
</template>

<style lang="scss" scoped></style>
