<script lang="ts" setup>
import { entityRemarkService } from '@/services/remark';
import { useList, type Pagination } from '@/hooks/useList';
import { useUserStore, useAuthStore } from '@/stores';
import { onReachBottom } from '@dcloudio/uni-app';
import RemarkEditor from './remark-editor.vue';
import { message, confirm } from '@/utils/common';
import dayjs from '@/utils/dayjs';

type Props = {
  entityId: string;
  entityType: Extract<EntityModel.EntityType, 'HydrogenTask' | 'Resume'>;
};

const props = defineProps<Props>();
const userStore = useUserStore();
const authStore = useAuthStore();
const remarkParams = ref({
  entityId: props.entityId,
  entityType: props.entityType
});

const { list, loadMore, loading, refresh } = useList(
  (pagination: Pagination) =>
    entityRemarkService.query({
      ...remarkParams.value,
      ...pagination
    }),
  {
    pageSize: 5
  }
);

const isEmpty = computed(() => !loading.value && !list.value?.length);

async function handleSubmit(content: string) {
  await entityRemarkService.create({
    ...remarkParams.value,
    content
  });

  message.success('备注添加成功');

  refresh();
}

async function handleDelete(remarkId: string) {
  await confirm('确定删除此备注？');

  await entityRemarkService.delete({
    ...remarkParams.value,
    remarkId
  });

  message.success('删除备注成功');

  refresh();
}

onReachBottom(loadMore);
</script>

<template>
  <view>
    <RemarkEditor @handle-confirm="handleSubmit">
      <view class="btn">添加备注</view>
    </RemarkEditor>

    <MImage v-if="isEmpty" class="w-full h-400px" src="https://cdn-fe.mesoor.com/custom/wanda/assets/package-icons/empty.png" />

    <scroll-view v-else scroll-y :show-scrollbar="false" class="min-h-400px">
      <view v-for="remark in list" :key="remark.id" class="remark-item">
        <view class="flex items-center mb-1">
          <MAvatar
            :size="30"
            :src="userStore.getUserById(remark.createdBy)?.avatar"
            :text="userStore.getUserById(remark.createdBy)?.username"
          />
          <text class="text-14px text-gray-700 ml-2 font-medium">{{ userStore.getUserById(remark.createdBy)?.username }}</text>
          <uni-icons type="smallcircle-filled" color="#D9D9D9" size="6" class="mx-2" />
          <text class="text-gray-500 flex-grow">{{ dayjs(remark.createdAt).fromNow() }}</text>
          <uni-icons
            type="trash"
            color="#ff997c"
            size="18"
            @click="handleDelete(remark.id)"
            v-if="authStore.user?.userId === remark.createdBy"
          />
        </view>

        <view class="whitespace-pre-wrap">{{ remark.content }}</view>
      </view>
    </scroll-view>
  </view>
</template>

<style lang="scss" scoped>
.remark-item {
  @apply py-3 flex flex-col gap-1;
  border-bottom: 1px solid #e9eae9a3;
}

.btn {
  @apply h-35px rounded-lg text-primary flex justify-center items-center text-14px font-medium;
  background-color: #42679511;
}
</style>
