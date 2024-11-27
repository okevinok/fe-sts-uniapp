<script lang="ts" setup>
import EntityList from '@/components/business/entity-list/index.vue';
import { useRequest } from '@/hooks/useRequest';
import { useEntityList } from '@/hooks/useList';
import { taskService, type GroupData } from '@/services/task';

const props = defineProps<{
  projectId: string;
}>();

const currentGroup = ref<GroupData>();

const { response: groups } = useRequest(() => taskService.queryGroups({ projectId: props.projectId }), {
  enablePullDownRefresh: true,
  showLoading: true,
  onSuccess(res) {
    currentGroup.value = res[0];
  }
});

const taskParams = computed<SearchModel.SearchEntityParams<'HydrogenTask'>>(() => ({
  view: 'board',
  entityType: 'HydrogenTask',
  groupId: currentGroup.value?.id,
  projectId: props.projectId,
  pageSize: 10
}));

const { list, loadMoreStatus } = useEntityList<'HydrogenTask'>(taskParams, {
  enablePullDownRefresh: true,
  required: () => !!taskParams.value.groupId,
  refreshDeps: [() => taskParams.value.groupId]
});

function handleGroupChange(group: GroupData) {
  currentGroup.value = group;
}
</script>

<template>
  <view class="sticky-wrapper">
    <scroll-view v-if="groups?.length" class="scroll-container" scroll-x :show-scrollbar="false">
      <MCheckTag
        v-for="group in groups"
        :key="group.id"
        :checked="currentGroup?.id === group.id"
        :cancelable="false"
        class="item"
        @change="handleGroupChange(group)"
      >
        {{ group.name }}
      </MCheckTag>
    </scroll-view>
  </view>

  <EntityList entity-type="HydrogenTask" :list="list" :load-more-status="loadMoreStatus" />
</template>

<style lang="scss" scoped>
.sticky-wrapper {
  @apply w-full flex items-center justify-between pt-5px pb-10px sticky top-40px z-1;
  background-color: $uni-bg-color;
}
.scroll-container {
  @apply whitespace-nowrap w-full;

  .item {
    margin-right: 16px;
    height: auto;
    display: inline-block;
  }
}
</style>
