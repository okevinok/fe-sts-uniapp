<script lang="ts">
export default { name: 'ResumeItem', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import UniRate from '@dcloudio/uni-ui/lib/uni-rate/uni-rate.vue';
import { useRouter } from '@/hooks/useRouter';
import { formatAgeString, formatDuration, formatLocation } from '@/utils/format';
import useSubscribeMessage from '@/hooks/useSubscribeMessage';

type Props = {
  data: EntityModel.BusinessEntity<'Resume'> | TaskModel.Task<'Resume'>;
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
const TAG_SHOW_COUNT = 3;

const isTask = (data: Props['data']): data is TaskModel.Task<'Resume'> => 'taskPayload' in props.data;

const task = computed(() => (isTask(props.data) ? props.data : undefined));
const resume = computed(() => (isTask(props.data) ? props.data.taskPayload?.payload : props.data));
const tags = computed(() => (isTask(props.data) ? props.data.tags : resumeStandardFields.value?.tags || []));

const score = computed(() => task.value?.extendData?.score ?? resume.value?.data.extraData?.score);
const resumeId = computed(() => resume.value?.meta.openId);
const resumeStandardFields = computed(() => resume.value?.data?.standardFields ?? {});

const resumeDescription = computed(() => {
  const age = formatAgeString(resumeStandardFields.value?.humanInfo?.age);
  const gender = resumeStandardFields.value?.humanInfo?.genderName;
  const degree = resumeStandardFields.value?.humanInfo?.highestEducationLevel;
  const city = formatLocation(resumeStandardFields.value?.contactInfo?.address, ['city']);

  return [gender, age, city, degree].filter(Boolean);
});

const works = computed(() => resumeStandardFields.value.works?.slice(0, 3));
const educations = computed(() => resumeStandardFields.value.educations?.slice(0, 2));

const { requestSubscribeMessage } = useSubscribeMessage();
function handleClick() {
  if (props.clickCallback) props.clickCallback(props.data);
  else {
    router.push('/packages/entity/detail/index', {
      query: {
        entityType: props.entityType,
        entityId: resumeId.value,
        taskId: task.value?.meta.openId
      }
    });
  }
  requestSubscribeMessage();
}
</script>

<template>
  <uni-list-item :key="resume?.meta.openId" class="list-item" direction="column" :border="false" clickable @click="handleClick">
    <template #header>
      <view class="item-header flex">
        <MAvatar
          class="mr-10px"
          :size="AVATAR_SIZE"
          :src="resumeStandardFields?.humanInfo?.avatar?.key || resumeStandardFields?.humanInfo?.avatar?.fileName"
          :text="resumeStandardFields?.humanInfo?.name"
        />
        <view class="w-full flex flex-col justify-center gap-6px">
          <view class="flex w-full">
            <view class="w-full flex justify-between items-center">
              <view class="text-16px font-medium">{{ resumeStandardFields?.humanInfo?.name ?? '匿名' }}</view>
              <UniRate v-if="score !== undefined" v-model="score" size="18" allow-half />
            </view>
          </view>

          <view class="text-13px text-gray-600">
            <!-- TODO 搜索 -->
            <view v-if="searchReason">{{ searchReason.desc }}</view>
            <view v-else class="flex items-center gap-1.5">
              <template v-if="resumeDescription.length">
                <template v-for="(text, index) in resumeDescription">
                  {{ text }}
                  <view v-if="index < resumeDescription.length - 1" :key="index" class="w-1px h-8px bg-gray-300"></view>
                </template>
              </template>
              <template v-else>暂无基本信息</template>
            </view>
          </view>

          <view v-if="tags.length" class="flex gap-6px flex-wrap">
            <MTag v-for="item in tags.slice(0, TAG_SHOW_COUNT)" :key="item.tagId" size="mini" :style="item.style">{{ item.name }}</MTag>
            <MTag v-if="tags.length - TAG_SHOW_COUNT > 0" size="mini">+{{ tags.length - TAG_SHOW_COUNT }}</MTag>
          </view>
        </view>
      </view>
    </template>
    <template #body>
      <view class="flex flex-col gap-10px mt-15px">
        <view v-if="works?.length" class="body-section">
          <view class="section-title-icon"><MIcon type="icon-gongzuo" /></view>
          <view class="section-content">
            <view v-for="(work, i) in works" :key="work.companyName + i" class="section-item">
              <view class="flex-1 truncate mr-10px min-w-1">{{ work.companyName || '' }} - {{ work.jobNames?.[0] || '' }}</view>
              <view class="w-60px text-gray-400 text-right">{{ formatDuration(work.dateRange) }}</view>
            </view>
          </view>
        </view>
        <view v-if="educations?.length" class="body-section">
          <view class="section-title-icon"><MIcon type="icon-xueli" /></view>
          <view class="section-content">
            <view v-for="(edu, i) in educations" :key="edu.schoolName ?? '' + i" class="section-item">
              <view class="section-item-left">{{ edu.schoolName || '' }} - {{ edu.degree?.name || '' }}</view>
              <view class="section-item-right">{{ formatDuration(edu.dateRange) }}</view>
            </view>
          </view>
        </view>
      </view>
    </template>
  </uni-list-item>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>
