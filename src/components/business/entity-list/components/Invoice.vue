<script lang="ts">
export default { name: 'ContractItem' };
</script>

<script lang="ts" setup>
import UserBasicInfo from '../../user/user-basic-info.vue';
import { useRouter } from '@/hooks/useRouter';
import { formatCurrency, formatDate, currencyUnits } from '@/utils/format';

type Props = {
  data: EntityModel.BusinessEntity<'Invoice'>;
  entityType: EntityModel.EntityType;
  clickCallback?: (item: Props['data']) => void;
};

const props = defineProps<Props>();

const router = useRouter();

const standardFields = computed(() => props.data.data.standardFields);
// TODO payload
const candidate = computed(() => standardFields.value.projectInformation?.candidate);

const meta = computed(() => [
  {
    label: '发票金额：',
    value: formatCurrency(standardFields.value?.feeInformation?.invoiceAmount) || '-'
  },
  {
    label: '开票日期：',
    value: formatDate(standardFields.value?.feeInformation?.dateOfInvoice) || '-'
  }
]);

const performanceDistribution = computed(() => standardFields.value?.performanceDistribution);

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
        <view class="text-14px font-medium truncate">{{ standardFields?.name }}</view>
        <MTag v-if="standardFields.feeInformation?.fees?.[0].feeType" type="primary" size="mini">
          {{ standardFields.feeInformation?.fees?.[0].feeType }}
        </MTag>
      </view>
    </template>
    <template #body>
      <view class="flex items-end justify-between">
        <view class="text-desc w-full">
          <view v-for="{ label, value } in meta" :key="label" class="flex gap-1 mb-2">
            <text class="text-gray-500">{{ label }}</text>
            <text class="font-medium">{{ value }}</text>
          </view>

          <view class="flex gap-1 w-full">
            <text class="text-gray-500 flex-shrink-0">业绩分配：</text>
            <view v-if="performanceDistribution?.length" class="w-full flex flex-col gap-2">
              <view v-for="(item, i) in performanceDistribution" :key="i" class="flex items-center justify-between gap-1">
                <UserBasicInfo :user-id="item.tenantMember?.openId" />
                <text class="break-all font-medium">{{ currencyUnits['CNY'] + Math.round(item.performanceAmount ?? 0) }}</text>
              </view>
            </view>
            <text v-else class="break-all">-</text>
          </view>
        </view>
      </view>
    </template>
  </uni-list-item>
</template>

<style lang="scss" scoped>
.text-desc {
  @apply text-12px text-[#666];
}
</style>
