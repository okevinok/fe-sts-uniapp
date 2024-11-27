<script lang="ts" setup>
import { useEntityList } from '@/hooks/useList';
import { memoize } from 'lodash-es';
import { taskService, type GroupData } from '@/services/task';
import { entityService } from '@/services/entity';
import { THEME_COLOR } from '@/config';
import { useAuthStore } from '@/stores';
import { EntityStatus } from '@/models/entity';

const popup = ref();
const search = ref('');
const emits = defineEmits<{
  (e: 'handleSelect', params: { stageId: string; projectId: string }): void;
}>();
const props = defineProps<{ entityId: string }>();
async function open() {
  popup.value?.open();
  !list.value?.length && (await refresh());
  checkExistence();
}

function close() {
  popup.value?.close();
}

const isShown = computed(() => !!popup.value?.showPopup);

defineExpose({
  open,
  isShown
});

const authStore = useAuthStore();

const listParams = computed<SearchModel.SearchEntityParams>(() => ({
  entityType: 'Project',
  query: search.value,
  // 根据状态过滤项目
  filters: [
    { key: 'meta.status', values: [EntityStatus.Normal] }
    // { key: 'data.standardFields.principal.openId', values: [authStore.tenantMemberId ?? ''] }
  ]
}));

const { list, refresh, loadMore } = useEntityList(listParams, {
  manual: true,
  enablePullDownRefresh: true,
  refreshDeps: [listParams]
});

const projectList = computed(() => list.value as ProjectModel.Project<'Job'>[]);
const selectedProject = ref<ProjectModel.Project<'Job'>>();
const groups = ref<GroupData[]>([]);
const queryGroups = memoize((projectId: string) => taskService.queryGroups({ projectId }));
const existedInProjects = ref<EntityModel.AssociatedInfo[]>([]);

async function checkExistence() {
  const res = await entityService.queryAssociate({
    entityType: 'Resume',
    entityIds: [props.entityId]
  });
  const existed = Object.values(res).flat();
  if (existed.length) {
    existedInProjects.value = existed;
  }
}

async function handleSelectProject(project: ProjectModel.Project<'Job'>) {
  selectedProject.value = selectedProject.value?.meta.openId === project.meta.openId ? undefined : project;
  groups.value = (await queryGroups(project.meta.openId)).filter((group) => group.id !== 'Mesoor');
}

async function handleSelectFlow(group: GroupData) {
  if (!selectedProject.value) return;
  await emits('handleSelect', {
    projectId: selectedProject.value?.meta.openId,
    stageId: group.id
  });
  checkExistence();
  popup.value?.close();
}
</script>

<template>
  <uni-popup ref="popup" type="bottom" :safe-area="false">
    <view class="popup-container">
      <view class="title">
        添加至项目
        <uni-icons type="closeempty" @click="close" />
      </view>

      <view class="search-bar">
        <MSearchbar placeholder="搜索项目" :modelValue="search" @change="(val) => (search = val ?? '')" />
      </view>

      <scroll-view scroll-y @scrolltolower="loadMore" :show-scrollbar="false" class="project-list">
        <template v-for="item in projectList" :key="item.meta.openId">
          <view
            class="project-item"
            :class="item.meta.openId === selectedProject?.meta.openId && `active`"
            @click="handleSelectProject(item)"
          >
            <view class="name">
              <view class="truncate">
                {{ item.name }}
              </view>

              <view class="flex text-12px text-gray-400">
                <text class="w-1/2 truncate">{{ item.projectPayload?.payload?.data.standardFields.company }}</text>
                <text class="w-1/2 truncate text-right" v-if="item.projectPayload?.payload?.meta.openId?.startsWith('gllue')">
                  {{ item.projectPayload?.payload?.meta.openId }}
                </text>
              </view>
            </view>

            <uni-tag
              v-if="existedInProjects.some((project) => project.projectId === item.meta.openId)"
              text="已存在"
              size="small"
              type="default"
              inverted
              circle
              class="ml-1"
            />

            <uni-icons type="forward" :color="item.meta.openId === selectedProject?.meta.openId ? THEME_COLOR : `#E1E1E3`" class="icon" />
          </view>

          <view v-if="item.meta.openId === selectedProject?.meta.openId" class="groups">
            <view v-for="group in groups" :key="group.id" class="group-item" @click="handleSelectFlow(group)">
              <uni-icons type="smallcircle-filled" :color="group.color" size="12" />
              <view class="name">{{ group.name }}</view>
            </view>
          </view>
        </template>
      </scroll-view>
    </view>
  </uni-popup>
</template>

<style lang="scss">
.popup-container {
  @apply bg-white h-85vh mx-2 flex flex-col;

  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  padding-bottom: var(--safe-area-inset-bottom);
  border-radius: 16px 16px 0 0;

  .title {
    @apply px-10px pt-15px text-gray-700 text-16px flex justify-between items-center font-medium;
    flex-shrink: 0;
  }

  .search-bar {
    flex-shrink: 0;
    padding: 10px;
  }
}

.project-list {
  flex-grow: 1;
  height: calc(100% - 80px);

  --border-bottom: 1px solid #e9eae9a3;

  .project-item {
    @apply flex gap-2 items-center h-55px px-15px box-border bg-white;
    border-bottom: var(--border-bottom);

    .name {
      @apply flex-grow truncate;
    }

    &.active {
      .name {
        @apply text-gray-700 font-medium;
      }
      .icon {
        @apply transition transform rotate-90;
      }
    }
  }

  .groups {
    border-bottom: var(--border-bottom);
  }

  .group-item {
    @apply flex gap-2 items-center h-45px pl-30px box-border;
    background-color: #f4f6f8;
    .name {
      flex-grow: 1;
      line-height: 45px;
    }
    &:not(:last-child) {
      .name {
        border-bottom: var(--border-bottom);
      }
    }
  }
}
</style>
