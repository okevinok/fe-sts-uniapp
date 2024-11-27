<script lang="ts" setup>
interface Props {
  modelValue?: Common.Priority;
  size?: number;
  clearable?: boolean;
}

interface Emits {
  (e: 'update:modelValue', value: Props['modelValue']): void;
}

interface Config {
  color: string;
  label: string;
}

const priorityFlagConfig: Partial<Record<Common.Priority, Config>> = {
  low: { color: '#9DA3AE', label: '较低' },
  medium: { color: '#28AAB4', label: '一般' },
  high: { color: '#FBB915', label: '优先' },
  urgent: { color: '#E04F45', label: '紧急' }
};

const unsetColor = '#9DA3AE';
const popup = ref();
const emits = defineEmits<Emits>();
const props = withDefaults(defineProps<Props>(), { size: 30, clearable: true });
const config = computed(() => (props.modelValue ? priorityFlagConfig[props.modelValue] : undefined));
const levelColor = computed(() => (props.modelValue ? config.value?.color : unsetColor));

async function open() {
  popup.value?.open();
}

function close() {
  popup.value?.close();
}

function handleSelect(priority: Common.Priority) {
  emits('update:modelValue', priority);
  close();
}
</script>

<template>
  <view>
    <view class="flex items-center gap-1" @click="open">
      <uni-icons :type="config ? 'flag-filled' : 'flag'" :color="levelColor" size="25" />
      <view
        :style="{
          color: levelColor
        }"
      >
        {{ config?.label ?? `设置优先级` }}
      </view>
    </view>

    <uni-popup ref="popup" type="bottom" :safe-area="false">
      <view class="popup-container">
        <view class="title">
          优先级
          <uni-icons type="closeempty" @click="close" />
        </view>

        <scroll-view scroll-y @scrolltolower="() => null" :show-scrollbar="false" class="list">
          <template v-for="priority in Object.entries(priorityFlagConfig)" :key="priority[0]">
            <view class="item" @click="handleSelect(priority[0] as Common.Priority)">
              <uni-icons type="flag-filled" :color="priority[1].color" size="25" />

              <view class="name">
                {{ priority[1].label }}
              </view>

              <uni-icons v-if="props.modelValue === priority[0]" type="checkmarkempty" class="m-icon text-14px text-primary" />
            </view>
          </template>

          <view class="item" @click="handleSelect('')" v-if="config">
            <uni-icons type="flag" :color="unsetColor" size="25" />
            <view class="name">清除</view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped>
.popup-container {
  @apply bg-white mx-2 flex flex-col;

  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  padding-bottom: var(--safe-area-inset-bottom);
  border-radius: 16px 16px 0 0;

  .title {
    @apply px-15px pt-15px text-gray-700 text-16px flex justify-between items-center font-medium;
    flex-shrink: 0;
  }
}

.list {
  flex-grow: 1;
  height: calc(100% - 80px);

  --border-bottom: 1px solid #e9eae9a3;

  .item {
    @apply flex gap-2 items-center h-50px px-15px box-border bg-white;
    border-bottom: var(--border-bottom);

    .name {
      @apply flex-grow;
    }
  }
}
</style>
