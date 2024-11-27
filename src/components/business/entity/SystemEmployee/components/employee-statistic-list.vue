<script lang="ts">
export default {
  name: 'EmployeeStatisticList',
  options: { virtualHost: true }
};
</script>

<script lang="ts" setup>
export type StatisticItem = {
  title: string;
  date: string;
  statistic: {
    val: number | string;
    color: string;
  };
};

type Props = {
  data: StatisticItem[];
  loadMoreStatus?: string;
};

const props = defineProps<Props>();
</script>

<template>
  <view class="employee-statistics">
    <uni-list :border="false" class="employee-statistics-list">
      <uni-list-item v-for="item in props.data" :key="item.title" :border="false" direction="column" class="employee-statistic-item">
        <template #header>
          <view class="w-full flex items-center justify-between p-2">
            <view>
              <view class="text-20px font-bold text-dark-800 mb-2">{{ item.title }}</view>
              <view class="text-14px font-light text-gray-400">{{ item.date }}</view>
            </view>
            <view class="text-36px" :style="{ color: item.statistic.color }">{{ item.statistic.val }}</view>
          </view>
        </template>
      </uni-list-item>
    </uni-list>
    <uni-load-more v-if="loadMoreStatus" :status="loadMoreStatus" />
  </view>
</template>

<style lang="scss" scoped></style>
