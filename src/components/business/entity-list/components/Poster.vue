<script lang="ts">
export default { name: 'JobItem' };
</script>

<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { formatLocation } from '@/utils/format';
import MTag from '@/components/basic/MTag.vue';

type Props = {
  data: ProjectModel.Project<'Poster'> | EntityModel.BusinessEntity<'Poster'>;
  clickCallback?: (item: Props['data']) => void;
};

const props = defineProps<Props>();

const router = useRouter();

const isProject = (data: Props['data']): data is ProjectModel.Project<'Poster'> => 'projectPayload' in props.data;

const project = computed(() => (isProject(props.data) ? props.data : undefined));
const data = computed(() => (isProject(props.data) ? project.value?.projectPayload?.payload : props.data));
const standardFields = computed(() => data.value?.data.standardFields);

const posterJob = computed(() => standardFields.value?.['Job']);

function handleClick() {
  if (posterJob.value) {
    router.push('/packages/poster-job-detail/index', {
      query: { entityId: data.value?.meta.openId }
    });
  } else {
    props.clickCallback?.(props.data);
  }
  // if (isProject(props.data)) {
  //   const projectId = props.data.meta.openId;
  //   router.push('/packages/project/index', { query: { projectId, projectName: project.value?.name } });
  // } else {
  //   props.clickCallback?.(props.data);
  // }
}
</script>

<template>
  <uni-list-item :key="data.meta.openId" class="list-item" direction="column" :border="false" clickable @click="handleClick">
    <template #header>
      <template v-if="posterJob">
        <view>
          <view class="flex items-center justify-between mb-3">
            <view class="text-primary font-medium truncate">{{ posterJob.name }}</view>
            <view class="text-gray-400 text-xs flex items-center gap-1">
              <uni-icons type="location" size="18" color="#999"></uni-icons>
              {{ formatLocation(posterJob.locations, ['city']) }}
            </view>
          </view>

          <view class="text-gray-500 text-xs">{{ posterJob.company }}</view>

          <view v-if="posterJob.keywords?.length" class="mt-2 flex items-center gap-2 flex-wrap">
            <MTag v-for="item in posterJob.keywords" :key="item" type="success">{{ item }}</MTag>
          </view>
        </view>
      </template>
    </template>
  </uni-list-item>
</template>

<style lang="scss" scoped></style>
