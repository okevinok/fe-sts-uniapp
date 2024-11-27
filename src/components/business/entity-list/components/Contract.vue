<script lang="ts">
export default { name: 'ContractItem' };
</script>

<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { formatDateRange } from '@/utils/format';

type Props = {
  data: EntityModel.BusinessEntity<'Contract'>;
  entityType: EntityModel.EntityType;
  clickCallback?: (item: Props['data']) => void;
};

const props = defineProps<Props>();

const router = useRouter();

const standardFields = computed(() => props.data.data.standardFields);

const meta = computed(() => [
  {
    label: '合同费率：',
    value: (standardFields.value?.businessTerm?.rate?.value ?? '-') + '%'
  },
  {
    label: '日期范围：',
    value: formatDateRange(standardFields.value?.validityPeriod, 'YYYY-MM-DD') ?? '-'
  }
]);

function handleClick() {
  router.push('/packages/entity/detail/index', {
    query: {
      entityType: props.entityType,
      entityId: props.data.meta.openId
    }
  });
}
</script>

<template>
  <uni-list-item class="list-item" direction="column" :border="false" clickable @click="handleClick">
    <template #header>
      <view class="flex justify-between items-center mb-10px text-[#333]">
        <view class="text-14px truncate">{{ standardFields?.name }}</view>
      </view>
    </template>
    <template #body>
      <view class="flex items-end justify-between">
        <view class="text-12px text-[#666]">
          <view v-for="{ label, value } in meta" :key="label" class="flex gap-1 mb-1">
            <text>{{ label }}</text>
            <text>{{ value }}</text>
          </view>
        </view>
      </view>
    </template>
  </uni-list-item>
</template>

<style lang="scss" scoped></style>
