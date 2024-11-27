<script lang="ts">
export default { name: 'BusinessPartnerItem' };
</script>

<script lang="ts" setup>
import Files from '@/components/business/other/files.vue';
import { useRouter } from '@/hooks/useRouter';
import { useUserStore } from '@/stores';
import { BP_STATUS_MAP } from '@/models/entity';

type Props = {
  data: EntityModel.BusinessEntity<'BusinessPartner'>;
  entityType: EntityModel.EntityType;
  clickCallback?: (item: Props['data']) => void;
};

const props = defineProps<Props>();

const router = useRouter();

const { getUserById } = useUserStore();

const standardFields = computed(() => props.data.data.standardFields);
const managedFields = computed(() => props.data.data.managedFields);

const bd = computed(() => getUserById(standardFields.value.bd?.openId || ''));

const invoiceLength = computed(() => managedFields.value?.entityRelated?.Invoice?.length ?? 0);

const projectStatistic = computed(() => {
  const projects = managedFields.value?.entityRelated?.Job || [];

  const count = projects.reduce(
    (prev, cur) => {
      if (cur['status'] === '进展中') prev.progress++;
      if (cur['status'] === '成功的') prev.success++;
      return prev;
    },
    { progress: 0, success: 0 }
  );

  return [
    { label: '所有项目', value: projects.length },
    { label: '进展中', value: count.progress },
    { label: '已成功', value: count.success },
    { label: '发票数', value: invoiceLength.value }
  ];
});

const getTextColor = (value: unknown) => (value ? 'text-gray-500' : 'text-gray-400');

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
      <view class="flex justify-between items-center mb-10px">
        <view class="text-16px font-medium truncate">{{ standardFields?.name ?? '-' }}</view>
        <MTag v-if="standardFields.status" :type="BP_STATUS_MAP.get(standardFields.status)" size="mini">{{ standardFields.status }}</MTag>
      </view>
    </template>
    <template #body>
      <view class="text-12px flex items-center gap-10px">
        <view v-for="({ label, value }, index) in projectStatistic" :key="label" class="flex items-center">
          <text class="text-gray-400 mr-2">{{ label }}</text>
          <text class="font-semibold" :class="getTextColor(value)">{{ value }}</text>
          <view v-if="index < projectStatistic.length - 1" :key="index" class="w-1px h-8px bg-gray-300 ml-10px"></view>
        </view>
      </view>

      <Files
        v-if="standardFields?.attachments?.length"
        class="mt-10px"
        :files="standardFields.attachments"
        :column="4"
        :maxDisplayCount="4"
        readonly
      />
      <view v-if="bd" class="mt-10px flex items-center justify-between gap-10px">
        <view class="flex items-center gap-2px">
          <MAvatar :src="bd.avatar" :size="18" class="mr-1" />
          <text class="text-13px text-gray-500">{{ bd?.username ?? '-' }}</text>
        </view>
      </view>
    </template>
  </uni-list-item>
</template>

<style lang="scss" scoped></style>
