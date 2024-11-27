<script lang="ts" setup>
import EmployeeStatisticList, { type StatisticItem } from './employee-statistic-list.vue';
import {
  employeeStatisticsService,
  type EmployeeStatisticType,
  type QueryEmployeeStatisticsParams,
  type EmployeeStatistic
} from '@/services/employee-statistics';
import { useList } from '@/hooks/useList';
import dayjs from 'dayjs';

const props = defineProps<{ entityId: string }>();

const day = dayjs();
const template = 'YYYY-MM-DD';
const lastWeek = day.subtract(1, 'week').startOf('week');
const [startTime, endTime] = [lastWeek.format(template), lastWeek.add(6, 'day').format(template)];

const getQueryParams = (): QueryEmployeeStatisticsParams => {
  return {
    startTime,
    endTime,
    entityId: props.entityId
  };
};

const { list, loadMoreStatus } = useList(() => employeeStatisticsService.query(getQueryParams()), {
  enablePullDownRefresh: true,
  required: () => props.entityId,
  refreshDeps: [() => props.entityId]
});

const listData = computed<StatisticItem[]>(() =>
  list.value.map((item) => ({
    title: item.title,
    date: getDate(item),
    statistic: getStatistic(item)
  }))
);

const getTypeColor = (type: EmployeeStatisticType) => {
  switch (type) {
    case 'Project':
      return '#147AD6';
    case 'Client':
      return '#EC6666';
    case 'RecommendCandidate':
      return '#79D2DE';
    case 'InterviewCandidate':
      return '#1940D9';
  }
};

const getDate = (item: EmployeeStatistic) => {
  switch (item.type) {
    case 'Project':
    case 'Client':
      return '截止' + item.endTime;
    case 'RecommendCandidate':
    case 'InterviewCandidate':
      return item.startTime + '-' + item.endTime;
    default:
      return '';
  }
};

const getStatistic = (item: EmployeeStatistic) => ({
  val: item.count,
  color: getTypeColor(item.type)
});
</script>

<template>
  <view>
    <EmployeeStatisticList :data="listData" :load-more-status="loadMoreStatus" />
  </view>
</template>

<style lang="scss"></style>
