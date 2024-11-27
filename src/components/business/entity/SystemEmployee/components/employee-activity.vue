<script lang="ts" setup>
import { noticeService } from '@/services/notice';
import { useList } from '@/hooks/useList';
import { useRouter } from '@/hooks/useRouter';
import { formatDate } from '@/utils/format';

const props = defineProps<{ entityId: string }>();
const router = useRouter();

const { list, loadMoreStatus } = useList(() => noticeService.getNotices({ userId: props.entityId }), {
  enablePullDownRefresh: true
});

const getTagStyle = (action: Notices.NoticeAction): Common.NormalizedField.EntityTag['style'] => {
  switch (action) {
    case 'BusinessPartnerCreated':
      return {
        color: '#6A8D6D',
        'background-color': '#E8F0E9'
      };
    case 'ProjectCreated':
      return {
        color: '#5F2AFF',
        'background-color': 'rgba(95, 42, 255, 0.1);'
      };
    case 'StageUpdated':
      return {
        color: '#EB5C20',
        'background-color': 'rgba(235, 92, 32, 0.1);'
      };
  }
};

function toDetail(item: Notices.Notice) {
  if (item.entityType === 'Project') {
    router.push('/packages/project/index', {
      query: {
        projectId: item.openId,
        projectName: item.title
      }
    });
  } else if (item.entityType === 'BusinessPartner') {
    router.push('/packages/entity/detail/index', {
      query: {
        entityType: 'BusinessPartner',
        entityId: item.openId
      }
    });
  } else if (item.entityType === 'HydrogenTask') {
    router.push('/packages/entity/detail/index', {
      query: {
        entityType: 'Resume',
        taskId: item.openId
      }
    });
  }
}
</script>

<template>
  <view class="employee-activity">
    <uni-list :border="false" class="notice-list">
      <uni-list-item
        v-for="item in list"
        :key="item.openId"
        :border="false"
        direction="column"
        class="notice-item"
        :clickable="true"
        @click="toDetail(item)"
      >
        <template #header>
          <view class="w-full">
            <view class="flex justify-between items-center mb-10px">
              <view class="font-semibold text-16px">{{ item.title }}</view>
              <MTag :style="{ ...getTagStyle(item.action) }" size="mini">{{ item.event }}</MTag>
            </view>
            <view class="flex justify-between items-center text-12px text-[#8D93A6]">
              <view class="truncate max-w-280px">{{ item.content }}</view>
              <view>{{ formatDate(item.createdAt, 'YYYY/MM/DD') }}</view>
            </view>
          </view>
        </template>
      </uni-list-item>
    </uni-list>
    <uni-load-more :status="loadMoreStatus" />
  </view>
</template>

<style lang="scss"></style>
