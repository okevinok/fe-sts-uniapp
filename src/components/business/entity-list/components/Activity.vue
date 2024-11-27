<script lang="ts">
export default { name: 'ActivityItem' };
</script>

<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { useUserStore } from '@/stores';

type Props = {
  data: ProjectModel.Project<'Activity'> | EntityModel.BusinessEntity<'Activity'>;
  clickCallback?: (item: Props['data']) => void;
};

const props = defineProps<Props>();

const { getUserById } = useUserStore();
const router = useRouter();

const isProject = (data: Props['data']): data is ProjectModel.Project<'Activity'> => 'projectPayload' in props.data;

const project = computed(() => (isProject(props.data) ? props.data : undefined));
const entity = computed(() => (isProject(props.data) ? project.value?.projectPayload?.payload : props.data));
const standardFields = computed(() => entity.value?.data.standardFields);

const principal = computed(() => getUserById(project.value?.principal?.openId || ''));

function handleClick() {
  if (isProject(props.data)) {
    const projectId = props.data.meta.openId;
    router.push('/packages/project/index', {
      query: {
        projectId,
        projectName: project.value?.name,
        payloadEntityType: 'Activity'
      }
    });
  } else {
    props.clickCallback?.(props.data);
  }
}
</script>

<template>
  <uni-list-item class="list-item" direction="column" :border="false" clickable @click="handleClick">
    <template #header>
      <view class="flex flex-col gap-10px text-12px text-gray-500">
        <view class="flex justify-between items-center">
          <view class="flex-1 text-16px text-black font-medium">{{ standardFields?.name || '-' }}</view>
        </view>
        <view class="">
          <MIcon type="icon-gongzuojingyan" />
          {{ standardFields?.organizerOfTheEvent }}
        </view>
        <view>
          <MIcon type="icon-time" />
          {{ standardFields?.dateOfEvent }}
        </view>
      </view>
    </template>
  </uni-list-item>
</template>

<style lang="scss" scoped></style>
