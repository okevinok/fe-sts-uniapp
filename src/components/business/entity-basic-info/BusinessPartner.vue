<script lang="ts">
export default {
  name: 'BusinessPartnerBasicInfo',
  options: { virtualHost: true }
};
</script>

<script lang="ts" setup>
import { formatDate, formatStringArray, formatFromNow } from '@/utils/format';
import { previewFiles } from '@/utils/file';
import { useUserStore } from '@/stores';
import { useRouter } from '@/hooks/useRouter';
import { copyText } from '@/utils/common';

type Props = {
  data?: EntityModel.BusinessEntity<'BusinessPartner'>;
  showMore?: boolean;
  loading?: boolean;
};

const props = defineProps<Props>();

const businessPartner = computed(() => props.data);

const userStore = useUserStore();
const bdUser = computed(() => userStore.getUserById(businessPartner.value?.data?.standardFields?.bd?.openId ?? ''));

function toBdDetail() {
  if (!bdUser.value) return;
  router.push('/packages/entity/detail/index', {
    query: { entityId: bdUser.value.userId, entityType: 'SystemEmployee' },
    data: { customStatusBar: true }
  });
}

const meta = computed(() => [
  {
    label: '状态',
    value: businessPartner.value?.data.standardFields.status || '-'
  },
  {
    label: '添加日期',
    value: formatDate(businessPartner.value?.meta.createdAt) || '-'
  },
  {
    label: '行业',
    value: formatStringArray(businessPartner.value?.data.standardFields.industries) || '-'
  },
  {
    label: 'BD渠道',
    value: formatStringArray(businessPartner.value?.data.standardFields.bdChannels) || '-'
  }
]);

const bpManagedFields = computed(() => businessPartner.value?.data.managedFields);

const projectStatistic = computed(() => {
  const projects = bpManagedFields.value?.entityRelated?.Job || [];

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
    {
      label: '发票数',
      value: bpManagedFields.value?.entityRelated?.Invoice?.length ?? 0
    }
  ];
});

const router = useRouter();
function openFile() {
  previewFiles(businessPartner.value?.data.standardFields.attachments ?? []);
}

function openDetail() {
  router.push('/packages/entity/detail/index', {
    query: {
      entityId: businessPartner.value?.meta.openId,
      entityType: 'BusinessPartner'
    }
  });
}
</script>

<template>
  <view v-if="businessPartner" class="card">
    <view class="bg p-20px flex flex-col gap-2 rounded-t">
      <view class="text-light-50 text-18px font-extrabold" @click="copyText(businessPartner?.data.standardFields.name)">
        {{ businessPartner?.data.standardFields.name }}
        <MIcon type="icon-copy" class="text-16px" />
      </view>
      <view class="text-gray-300 text-12px">客户更新于 {{ formatFromNow(businessPartner?.meta.updatedAt) }}</view>
    </view>

    <view class="card-meta">
      <view v-for="item in meta" :key="item.label" class="item">
        <view class="label">{{ item.label }}</view>
        <text>{{ item.value }}</text>
      </view>

      <view class="item" @click="toBdDetail">
        <view class="label">BD顾问</view>
        <view class="inline-flex items-center gap-2" v-if="bdUser">
          <MAvatar :src="bdUser?.avatar" :size="20" />
          <text>{{ bdUser?.username }}</text>
        </view>
        <text v-else>-</text>
      </view>
      <view class="item">
        <view class="label">附件</view>
        <view>
          <view v-if="businessPartner?.data.standardFields.attachments?.length" class="text-primary" @click="openFile">
            <uni-icons type="paperclip" class="m-icon text-16px" />
            {{ businessPartner?.data.standardFields.attachments?.length }}份
          </view>
          <template v-else>-</template>
        </view>
      </view>

      <template v-if="projectStatistic.length">
        <view class="divider" />

        <view v-for="({ label, value }, index) in projectStatistic" :key="index" class="item">
          <view class="label">{{ label }}</view>
          <text>{{ value }}</text>
        </view>
      </template>
    </view>
    <view v-if="props.showMore" class="pb-10px flex items-center justify-center">
      <MButton type="primary" text @click="openDetail">查看更多信息</MButton>
    </view>
  </view>
  <view v-else class="p-15px text-center text-gray-400">{{ loading ? '加载中...' : '暂无信息' }}</view>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/basic-info.scss';
</style>
