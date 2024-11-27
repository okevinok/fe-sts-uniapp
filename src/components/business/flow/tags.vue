<script lang="ts">
export default { name: 'Tags', options: { virtualHost: true } };
</script>
<script lang="ts" setup>
import { tagLibraryService, entityTagsService } from '@/services/tag';
import { useList } from '@/hooks/useList';
import { predefineColors } from '@/config/entity';
import { mixColor } from '@/utils/color';
import { useAuthStore } from '@/stores';

interface Emits {
  (e: 'refresh'): void;
}

type Props = {
  tags?: TagModel.EntityTag[];
  entityId: string;
  entityType: EntityModel.EntityType;
  canEdit?: boolean;
};

const props = withDefaults(defineProps<Props>(), { canEdit: true });

const popup = ref();
const emits = defineEmits<Emits>();
const search = ref('');
const authStore = useAuthStore();

async function open() {
  if (!authStore.isNormalUser) return;
  if (!props.canEdit) return;
  search.value = '';
  popup.value?.open();
  !list.value?.length && refresh();
}

function close() {
  popup.value?.close();
}

const { list, loadMore, loading, refresh } = useList(
  (pagination) =>
    tagLibraryService.query({
      name: search.value,
      type: props.entityType,
      ...pagination
    }),
  {
    refreshDeps: [search],
    manual: true
  }
);

const shouldCreate = computed(() => {
  return search.value && !list.value?.some((tag) => tag.name === search.value);
});

const filteredAppliedTags = computed(() => {
  return props.tags?.filter((tag) => tag.name.includes(search.value));
});

const unappliedTags = computed(() => {
  return list.value?.filter((tag) => !props.tags?.some((v) => v.tagId === tag.meta.openId) && tag.name.includes(search.value));
});

async function handleSelectTag(tag: TagModel.TagLibrary | TagModel.EntityTag) {
  const tagId = 'meta' in tag ? tag.meta.openId : tag.tagId;

  if (props.tags?.some((_tag) => _tag.tagId === tagId)) {
    await entityTagsService.delete({
      entityId: props.entityId,
      entityType: props.entityType,
      tagLibraryId: tagId
    });
  } else {
    await entityTagsService.create({
      entityIds: [props.entityId],
      entityType: props.entityType,
      tagLibraryIds: [tagId]
    });
  }

  emits('refresh');
}

function getCreateTagStyle() {
  const color = predefineColors[Math.floor(Math.random() * predefineColors.length)];
  return { color, 'background-color': mixColor('#ffffff', color, 0.1) };
}

async function handleCreateLibraryTag() {
  const newTag = await tagLibraryService.create({
    type: props.entityType,
    editable: true,
    name: search.value,
    style: getCreateTagStyle()
  });

  search.value = '';

  await handleSelectTag(newTag);
}
</script>

<template>
  <view>
    <view @click="open">
      <slot />
    </view>

    <uni-popup ref="popup" type="bottom" :safe-area="false">
      <view class="popup-container">
        <view class="title">
          标签
          <uni-icons type="closeempty" @click="close" />
        </view>

        <view class="search-bar">
          <MSearchbar
            placeholder="搜索标签"
            :modelValue="search"
            cancelButton="none"
            bgColor="#f4f6f8"
            @change="(val) => (search = val ?? '')"
          />
        </view>

        <scroll-view scroll-y @scrolltolower="loadMore" class="list">
          <view v-if="shouldCreate" class="create-item" @click="handleCreateLibraryTag">
            <uni-icons type="plus" class="m-icon text-18px text-gray-400" />
            <text class="text-gray-400">创建标签</text>
            <text class="font-medium">“{{ search }}”</text>
          </view>

          <view v-for="tag in filteredAppliedTags" :key="tag.tagId" :style="tag.style" class="item" @click="handleSelectTag(tag)">
            <view class="name truncate">{{ tag.name }}</view>
            <uni-icons type="checkmarkempty" class="m-icon text-16px font-semibold" :style="{ color: tag.style.color }" />
          </view>

          <view v-for="tag in unappliedTags" :key="tag.meta.openId" :style="tag.style" class="item" @click="handleSelectTag(tag)">
            <view class="truncate">{{ tag.name }}</view>
          </view>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped>
.popup-container {
  @apply bg-white mx-2 flex flex-col h-80vh;
  --border-bottom: 1px solid #e9eae9a3;
  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  padding-bottom: var(--safe-area-inset-bottom);
  border-radius: 16px 16px 0 0;

  .title {
    @apply text-gray-700 text-16px flex p-15px pb-0 justify-between items-center font-medium flex-shrink-0;
  }

  .search-bar {
    border-bottom: var(--border-bottom);
    padding: 10px;
    margin-bottom: 10px;
  }
}

.list {
  flex-grow: 1;
  height: calc(100% - 130px);

  .item {
    @apply flex gap-2 items-center h-40px px-20px box-border bg-white rounded-lg mx-10px mb-10px;

    .name {
      @apply flex-grow;
    }
  }
}

.create-item {
  @apply flex items-center gap-2 h-40px px-15px mb-8px;
}
</style>
