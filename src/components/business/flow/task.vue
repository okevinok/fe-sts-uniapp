<script lang="ts">
export default { name: 'TaskPanel', options: { virtualHost: true } };
</script>
<script lang="ts" setup>
import { message, getContrastingTextColor } from '@/utils/common';
import { useUserStore } from '@/stores';
import Priority from './priority.vue';
import UserSelector from './user-selector.vue';
import FlowSelector from './flow-selector.vue';
import { taskService, type TaskModifyParams } from '@/services/task';

interface Props {
  taskId: string;
  modelValue?: TaskModel.Task;
  entityId?: string;
}

interface Emits {
  (e: 'update:modelValue', value: Props['modelValue']): void;
}

const emits = defineEmits<Emits>();
const props = defineProps<Props>();
const assignee = computed(() => useUserStore().getUserById(props.modelValue?.current?.assignee?.openId ?? ''));

async function handleModifyTask(field: keyof TaskModifyParams, value: any) {
  const task = await taskService.updateTask({
    taskId: props.taskId,
    [field]: value
  });
  emits('update:modelValue', task);
  message.success('修改成功');
}

async function handleModifyStage(stageId: string) {
  const task = await taskService.updateFlowStage({
    stageId,
    taskId: props.taskId
  });
  emits('update:modelValue', task);
  message.success('修改成功');
}
</script>

<template>
  <view v-if="props.modelValue" class="task-container">
    <view class="items">
      <view class="item">
        <view class="label">流程</view>
        <FlowSelector
          v-if="modelValue?.project?.openId"
          :project-id="modelValue?.project?.openId"
          :stage-id="modelValue?.current?.stageId"
          class="flex-grow"
          @handle-select="handleModifyStage"
        >
          <view
            class="rounded-lg h-26px flex items-center justify-center transition"
            :style="{
              background: modelValue?.current.stage.extend.color,
              color: getContrastingTextColor(modelValue?.current.stage.extend.color ?? '')
            }"
          >
            {{ modelValue?.current.stageName }}
          </view>
        </FlowSelector>
      </view>
      <view class="item">
        <view class="label">优先级</view>
        <Priority :model-value="modelValue?.extendData?.priority" @update:model-value="(value) => handleModifyTask('priority', value)" />
      </view>
      <view class="item">
        <view class="label">负责人</view>
        <UserSelector :user-id="assignee?.userId" @handle-select="(userId) => handleModifyTask('assignId', userId)" />
      </view>
      <view class="item">
        <view class="label">期限</view>
        <view class="flex gap-1 items-center text-13px">
          <uni-icons
            type="calendar"
            class="m-icon text-14px"
            :class="modelValue?.extendData?.startTime ? `text-gray-800` : `text-gray-400`"
          />
          <MDateSelect
            :model-value="modelValue?.extendData?.startTime"
            placeholder="开始时间"
            iso
            @update:model-value="(value) => handleModifyTask('startTime', value)"
          />
          <view class="mx-1 font-semibold">~</view>
          <uni-icons
            type="calendar"
            class="m-icon text-14px"
            :class="modelValue?.extendData?.timeoutTime ? `text-gray-800` : `text-gray-400`"
          />
          <MDateSelect
            :model-value="modelValue?.extendData?.timeoutTime"
            placeholder="截止时间"
            iso
            @update:model-value="(value) => handleModifyTask('timeoutTime', value)"
          />
        </view>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.task-container {
  @apply w-full  rounded-md bg-white;
  .items {
    @apply rounded-xl;
    background: #f7f8fa;
    .item {
      @apply px-3 flex justify-between gap-2 items-center text-gray-600 text-xs;
      height: 40px;
      .label {
        width: 70px;
      }
      &:not(:last-child) {
        border-bottom: 1px solid #e9eae9a3;
      }
    }
  }
}
</style>
