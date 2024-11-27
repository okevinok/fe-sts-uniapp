<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';

type Props = {
  modelValue: SystemEmployeeModel.SystemEmployee;
  isSelf?: boolean;
  clickCallback?: () => void;
};

type Emits = {
  (e: 'updateModelValue', val: SystemEmployeeModel.SystemEmployee): void;
};

const props = defineProps<Props>();

const emits = defineEmits<Emits>();

const router = useRouter();

const entityId = computed(() => props.modelValue.meta.openId);
const standardFields = computed(() => props.modelValue.data.standardFields);
const manageFields = computed(() => props.modelValue.data.managedFields);
const name = computed(() => standardFields.value?.humanInfo?.nickname || standardFields.value?.humanInfo?.name);
const avatarKey = computed(() => standardFields.value?.humanInfo?.avatar?.key);

function handleClickBasicInfo() {
  if (!props.isSelf) return;

  const query = { entityId: entityId.value, entityType: 'SystemEmployee' };
  router.push('/packages/entity/edit/index', {
    query,
    data: {
      entity: props.modelValue,
      refresh: props.clickCallback
    }
  });
}
</script>

<template>
  <view class="w-full" @click="handleClickBasicInfo">
    <view class="flex gap-3 mb-16px items-center relative">
      <uni-icons v-if="isSelf" class="absolute right-0 top-[50%] transform translate-y-[-50%]" type="forward" size="18" color="#999" />
      <MAvatar :src="avatarKey" :size="60" :text="name" />
      <view class="flex flex-col gap-2">
        <text class="text-20px text-dark-50 font-medium">
          {{ name }}
        </text>
        <text class="text-14px text-gray-600 leading-[1.1]">
          {{ standardFields?.employeeInfo?.currentPosition?.teamName || '未知团队' }}
          -
          {{ standardFields?.employeeInfo?.currentPosition?.jobName || '未知职位' }}
        </text>
      </view>
    </view>

    <view class="text-14px text-gray-500">{{ standardFields?.description || '这个顾问有点懒,什么都没留下。。。' }}</view>

    <view class="evaluation-wrapper">
      <view class="mr-10px">好评率 {{ Math.round((manageFields?.evaluationInfo?.positiveEvaluationRate ?? 0) * 100) }}%</view>
      <uni-rate size="14" :value="manageFields?.evaluationInfo?.averageRating ?? 0" />
      <view class="ml-20px">评价数 {{ manageFields?.evaluationInfo?.totalEvaluationCount ?? 0 }}个</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.evaluation-wrapper {
  margin-top: 10px;
  display: flex;
  align-items: center;
  @apply text-gray-500;
}
</style>
