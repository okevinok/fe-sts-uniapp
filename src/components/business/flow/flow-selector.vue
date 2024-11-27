<script lang="ts" setup>
import { taskService, type GroupData } from '@/services/task';

const emits = defineEmits<{
  (e: 'handleSelect', stageId: string): void;
}>();
const props = defineProps<{ stageId: string; projectId: string }>();
const popup = ref();

async function open() {
  popup.value?.open();
  !groups.value?.length && (await handleQueryGroups());
}

function close() {
  popup.value?.close();
}

const isShown = computed(() => !!popup.value?.showPopup);

defineExpose({
  open,
  isShown
});

const groups = ref<GroupData[]>([]);
const groupWithSubs = ref<GroupData>();

async function handleQueryGroups() {
  const _groups = (await taskService.queryGroups({ projectId: props.projectId })).filter((group) => group.id !== 'Mesoor');
  groups.value = _groups;
  const _groupWithSubs = _groups.find((g) => props.stageId.includes(g.id));
  groupWithSubs.value = _groupWithSubs;
}

async function handleSelectFlow(group: GroupData) {
  // 收起子流程
  if (groupWithSubs.value?.id === group.id) {
    groupWithSubs.value = undefined;
  }
  // 展开子流程
  else if (group.subGroups?.length) {
    groupWithSubs.value = group;
  }
  // 选择流程
  else {
    emits('handleSelect', group.id);
    popup.value?.close();
  }
}
</script>

<template>
  <view class="w-full">
    <view @click="open" class="w-full">
      <slot />
    </view>

    <uni-popup ref="popup" type="bottom" :safe-area="false">
      <view class="popup-container">
        <view class="title">
          选择流程
          <uni-icons type="closeempty" @click="close" />
        </view>

        <scroll-view scroll-y :show-scrollbar="false" class="groups">
          <template v-for="group in groups" :key="group.id">
            <view class="group-item" @click="handleSelectFlow(group)">
              <uni-icons type="smallcircle-filled" :color="group.color" size="12" />
              <view class="name">
                {{ group.name }}

                <uni-icons
                  v-if="group.subGroups?.length"
                  type="forward"
                  class="m-icon text-16px text-gray-400 font-semibold transition"
                  :class="groupWithSubs?.id === group.id && `transform rotate-90 text-gray-600`"
                />

                <uni-icons v-if="props.stageId === group.id" type="checkmarkempty" class="m-icon text-14px text-primary" />
              </view>
            </view>
            <!-- 子流程列表 -->
            <template v-if="groupWithSubs?.id === group.id">
              <view
                v-for="group in groupWithSubs.subGroups"
                :key="group.id"
                class="group-item group-item-sub"
                @click="handleSelectFlow(group)"
              >
                <uni-icons type="smallcircle-filled" :color="group.color" size="12" />
                <view class="name">
                  {{ group.name }}
                  <uni-icons v-if="props.stageId === group.id" type="checkmarkempty" class="m-icon text-14px text-primary" />
                </view>
              </view>
            </template>
          </template>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<style lang="scss">
.popup-container {
  @apply bg-white mx-2 flex flex-col h-70vh;

  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  padding-bottom: var(--safe-area-inset-bottom);
  border-radius: 16px 16px 0 0;

  .title {
    @apply px-15px py-15px text-gray-700 text-16px flex justify-between items-center font-medium;
    flex-shrink: 0;
  }
  .search-bar {
    flex-shrink: 0;
  }
}

.groups {
  flex-grow: 1;
  height: calc(100% - 80px);

  --border-bottom: 1px solid #e9eae9a3;

  .group-item {
    @apply flex gap-2 items-center h-45px pl-15px box-border;

    &-sub {
      padding-left: 30px;
      background-color: #f4f6f8;
    }

    .name {
      @apply flex justify-between items-center pr-15px leading-45px flex-grow;
    }

    &:not(:last-child):not(.group-item-sub) {
      .name {
        border-bottom: var(--border-bottom);
      }
    }
  }
}
</style>
