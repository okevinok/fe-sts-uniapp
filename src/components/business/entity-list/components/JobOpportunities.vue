<script lang="ts">
export default { name: 'JobOpportunitiesItem' };
</script>

<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { formatDate, formatLocation, formatNumberRange, formatSalaryRange } from '@/utils/format';

type Props = {
  data: EntityModel.BusinessEntity<'JobOpportunities'>;
  clickCallback?: (item: Props['data']) => void;
};

const props = defineProps<Props>();

const router = useRouter();

const jobOpportunities = computed(() => props.data);
const standardFields = computed(() => jobOpportunities.value?.data.standardFields);

const formattedInfo = computed(() => {
  const city = formatLocation(standardFields.value?.locations, ['city']);
  const workYear = standardFields.value?.workExperienceRequirement
    ? formatNumberRange(standardFields.value?.workExperienceRequirement, {
        unit: '年'
      }) + '经验'
    : undefined;
  const salaryRange = formatSalaryRange(standardFields.value?.salaryRange);
  return [city, workYear, salaryRange].filter((item) => !!item).join(' / ');
});

function handleClick() {
  router.push('/packages/entity/detail/index', {
    query: {
      entityType: 'JobOpportunities',
      entityId: props.data.meta.openId
    }
  });
}
</script>

<template>
  <uni-list-item class="list-item" direction="column" :border="false" clickable @click="handleClick">
    <template #header>
      <view class="flex flex-col gap-10px">
        <view class="flex justify-between items-center">
          <view class="flex-1 text-16px font-medium">{{ standardFields?.name || '-' }}</view>
        </view>
        <view class="text-gray-600 text-12px">{{ formattedInfo }}</view>
        <view class="flex justify-between items-center text-gray-400 text-12px">
          <text class="mr-10px">{{ standardFields?.company ?? '' }}</text>
          <text>更新于 {{ formatDate(jobOpportunities?.meta.updatedAt) }}</text>
        </view>
      </view>
    </template>
  </uni-list-item>
</template>

<style lang="scss" scoped></style>
