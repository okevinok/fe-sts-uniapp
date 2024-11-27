<script lang="ts">
export default { name: 'JobItem' };
</script>

<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { useUserStore } from '@/stores';
import { JOB_STATUS_MAP } from '@/models/entity';
import { formatSalaryRange, formatStringArray } from '@/utils/format';

type Props = {
  data: ProjectModel.Project<'Job'> | EntityModel.BusinessEntity<'Job'>;
  clickCallback?: (item: Props['data']) => void;
};

const props = defineProps<Props>();

console.log('project', props);

const { getUserById } = useUserStore();
const router = useRouter();

const isProject = (data: Props['data']): data is ProjectModel.Project<'Job'> => 'projectPayload' in props.data;

const project = computed(() => (isProject(props.data) ? props.data : undefined));
const job = computed(() => (isProject(props.data) ? project.value?.projectPayload?.payload : props.data));
const standardFields = computed(() => job.value?.data.standardFields);

const principal = computed(() => getUserById(project.value?.principal?.openId || ''));

const status = computed(() => standardFields.value?.headhunterRequestDetail?.status);

function handleClick() {
  if (isProject(props.data)) {
    const projectId = props.data.meta.openId;
    router.push('/packages/project/index', {
      query: { projectId, projectName: project.value?.name }
    });
  } else {
    props.clickCallback?.(props.data);
  }
}
</script>

<template>
  <uni-list-item class="list-item" direction="column" :border="false" clickable @click="handleClick">
    <template #header>
      <view class="flex flex-col gap-10px">
        <view class="flex justify-between items-center">
          <view class="flex-1 text-16px font-medium">{{ standardFields?.name || '-' }}</view>
          <view v-if="standardFields?.salaryRange?.length" class="text-12px w-120px text-right">
            {{ formatSalaryRange(standardFields.salaryRange[0]) }}
          </view>
        </view>
        <view class="text-[#666] text-12px">
          <text class="mr-10px">{{ standardFields?.company ?? '' }}</text>
          <text>{{ formatStringArray(standardFields?.locations, 'city') ?? '' }}</text>
        </view>
        <view class="flex flex-wrap gap-6px">
          <MTag v-if="status" :type="JOB_STATUS_MAP.get(status)" size="mini">{{ status }}</MTag>
          <MTag size="mini" secondary>分成比例：{{ standardFields?.headhunterRequestDetail?.projectChargeRatio?.value ?? '-' }}%</MTag>
        </view>
        <view v-if="isProject(data) && principal" class="flex justify-between items-center">
          <view class="flex items-center">
            <MAvatar :src="principal?.avatar" :size="18" class="mr-1" />
            <view class="text-13px text-gray-500">{{ principal?.username || '-' }}</view>
          </view>
        </view>
      </view>
    </template>
  </uni-list-item>
</template>

<style lang="scss" scoped></style>
