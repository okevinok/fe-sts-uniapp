<script lang="ts">
export default { name: 'SystemEmployeeItem', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { formatPathValue } from '@/utils/format';

type Props = {
  data: EntityModel.BusinessEntity<'SystemEmployee'> | TaskModel.Task<'SystemEmployee'>;
  entityType: EntityModel.EntityType;
  searchReason?: {
    desc: string;
    keywords: string;
  };
  clickCallback?: (item: Props['data']) => void;
};

const props = defineProps<Props>();
const router = useRouter();

const AVATAR_SIZE = 40;
const TAG_SHOW_COUNT = 5;

const isTask = (data: Props['data']): data is TaskModel.Task<'SystemEmployee'> => 'taskPayload' in props.data;

const task = computed(() => (isTask(props.data) ? props.data : undefined));
const entity = computed(() => (isTask(props.data) ? props.data.taskPayload?.payload : props.data));
const entityId = computed(() => entity.value?.meta.openId);
const standardFields = computed(() => entity.value?.data.standardFields);
const tags = computed(() => (isTask(props.data) ? props.data.tags : standardFields.value?.tags || []));
const name = computed(() => standardFields.value?.humanInfo?.nickname || standardFields.value?.humanInfo?.name || '');
const description = computed(() => standardFields.value?.description);
const concernInfo = computed(() => standardFields.value?.employeeInfo?.concernInfo);

const getPathValuesLabel = (data: string[]) => data.map(formatPathValue).join('，');

function handleClick() {
  if (props.clickCallback) props.clickCallback(props.data);
  else {
    router.push('/packages/entity/detail/index', {
      query: {
        entityType: props.entityType,
        entityId: entityId.value,
        taskId: task.value?.meta.openId
      },
      data: { customStatusBar: true }
    });
  }
}
</script>

<template>
  <uni-list-item :key="entity?.meta.openId" class="list-item" direction="column" :border="false" clickable @click="handleClick">
    <template #header>
      <view class="item-header">
        <view class="flex items-center">
          <MAvatar
            class="mr-10px"
            :size="AVATAR_SIZE"
            :src="standardFields?.humanInfo?.avatar?.key || standardFields?.humanInfo?.avatar?.fileName"
            :text="name"
          />
          <view class="w-full flex flex-col justify-center gap-6px">
            <view class="flex w-full text-16px font-medium">
              {{ name }}
            </view>
            <view class="text-12px text-gray-500 leading-[1.1]">
              {{ standardFields?.employeeInfo?.currentPosition?.teamName || '未知团队' }}
              -
              {{ standardFields?.employeeInfo?.currentPosition?.jobName || '未知职位' }}
            </view>

            <view v-if="searchReason || description" class="text-12px text-gray-500">
              <!-- TODO 搜索 -->
              <view v-if="searchReason">{{ searchReason.desc }}</view>
              <view v-else>{{ description }}</view>
            </view>
          </view>
        </view>

        <view v-if="tags.length" class="mt-10px flex gap-6px flex-wrap">
          <MTag v-for="item in tags.slice(0, TAG_SHOW_COUNT)" :key="item.tagId" size="mini" :style="item.style">{{ item.name }}</MTag>
          <MTag v-if="tags.length - TAG_SHOW_COUNT > 0" size="mini">+{{ tags.length - TAG_SHOW_COUNT }}</MTag>
        </view>
      </view>
    </template>

    <template #body>
      <view v-if="concernInfo?.industries?.length || concernInfo?.categories?.length" class="item-body mt-15px">
        <view v-if="concernInfo?.industries?.length" class="body-section">
          <view class="section-title w-80px">关注的行业</view>
          <view class="section-content">
            <view class="section-item">{{ getPathValuesLabel(concernInfo.industries) }}</view>
          </view>
        </view>
        <view v-if="concernInfo?.categories?.length" class="mt-4px body-section">
          <view class="section-title w-80px">关注的职能</view>
          <view class="section-content">
            <view class="section-item">{{ getPathValuesLabel(concernInfo.categories) }}</view>
          </view>
        </view>
      </view>
    </template>
  </uni-list-item>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>
