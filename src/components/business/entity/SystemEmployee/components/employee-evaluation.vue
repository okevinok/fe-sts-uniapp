<script lang="ts" setup>
import { formatDate } from '@/utils/format';

const props = defineProps<{ evaluations: EvaluationModel.Evaluation[] }>();
</script>

<template>
  <view class="w-full mx-auto p-16px">
    <view v-if="props.evaluations.length">
      <view v-for="item in props.evaluations" :key="item.id" class="evaluation-item">
        <MAvatar random :size="32" class="absolute -left-16px -top-16px" />
        <view class="w-full p-16px pt-0">
          <view class="text-14px font-semibold text-dark-600">CGL顾问</view>
          <view class="w-full flex justify-between mt-10px mb-12px">
            <uni-rate :value="item.rating" size="18" />
            <view class="text-12px text-gray-400">{{ formatDate(item.createdAt, 'YYYY/MM/DD') }}</view>
          </view>
          <view class="text-14px text-dark-600 opacity-80 leading-5">{{ item.content || '暂无评价内容' }}</view>
        </view>
      </view>
    </view>

    <view v-else>暂无评价</view>
  </view>
</template>

<style lang="scss" scoped>
.evaluation-item {
  @apply w-full relative mb-32px bg-white;
  box-shadow: 0px 1px 25px 0px rgba(0, 0, 0, 0.05);
  border-radius: 8px;
}
</style>
