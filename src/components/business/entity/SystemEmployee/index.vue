<script lang="ts" setup>
import EmployeeBasicInfo from './components/employee-basic-info.vue';
import EmployeeAbout from './components/employee-about.vue';
import EmployeeActivity from './components/employee-activity.vue';
import EmployeeEvaluation from './components/employee-evaluation.vue';
import EmployeeWeekStatistics from './components/employee-week-statistics.vue';
import { useAuthStore, useAppStore } from '@/stores';
import { useList } from '@/hooks/useList';
import { useRequest } from '@/hooks/useRequest';
import { useTabs } from '@/hooks/useTabs';
import { entityService } from '@/services/entity';
import { truthy } from '@/utils/types';
import dayjs from 'dayjs';

type Props = {
  entity: SystemEmployeeModel.SystemEmployee;
  /** 评价更新的 key */
  evaluationUpdatedKey?: number;
  hasRouteControl?: boolean;
  hasFooter?: boolean;
  showTopBar?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  hasRouteControl: true,
  hasFooter: false
});

const authStore = useAuthStore();
const { miniAppNavHeight, menuButtonInfo } = useAppStore();

const backIconSize = 20;
const systemInfo = uni.getSystemInfoSync();
const statusBarHeight = systemInfo.statusBarHeight ?? 0;
const windowWidth = systemInfo.windowWidth;

const entityId = computed(() => props.entity?.meta.openId);
const isSelf = computed(() => authStore.user?.userId === entityId.value);

const ENTITY_TYPE = 'SystemEmployee';
const entity = ref(props.entity);
const standardFields = computed(() => entity.value?.data.standardFields);
const name = computed(() => standardFields.value?.humanInfo?.nickname || standardFields.value?.humanInfo?.name);
const avatarKey = computed(() => standardFields.value?.humanInfo?.avatar?.key);

const isNewEmployee = computed(() => {
  const hireDate = standardFields.value?.employeeInfo?.hireDate;
  return !!(hireDate && dayjs(hireDate).isAfter(dayjs().subtract(6, 'month').startOf('day')));
});

const entityChangedKey = ref(0);
const shouldQueryEntity = () => !!(entityChangedKey.value || props.evaluationUpdatedKey);
const commonRequestOption = { enablePullDownRefresh: true, showLoading: true };

const { refresh: refreshEntity } = useRequest(
  () =>
    entityService.queryDetail<'SystemEmployee'>({
      entityId: entityId.value,
      entityType: ENTITY_TYPE
    }),
  {
    ...commonRequestOption,
    required: shouldQueryEntity,
    refreshDeps: [shouldQueryEntity],
    onSuccess(res) {
      entity.value = res;
      if (isSelf.value) {
        authStore.setSystemEmployee(res);
      }
    }
  }
);

const { list: evaluations } = useList(
  (pagination) =>
    entityService.queryEntityEvaluations({
      entityId: entityId.value,
      entityType: 'SystemEmployee',
      ...pagination
    }),
  {
    ...commonRequestOption,
    required: [entityId],
    refreshDeps: [entityId, () => props.evaluationUpdatedKey]
  }
);

const tabsData = computed(() => {
  const val = isSelf.value ? '我' : 'TA';
  return [
    { label: `关于${val}`, value: 'about' },
    { label: `${val}的动态`, value: 'activity' },
    { label: `${val}的评价`, value: 'evaluation' },
    isSelf.value && isNewEmployee.value && { label: '新人周报', value: 'statistics' }
  ].filter(truthy);
});

const { tabs, currentTabValue } = useTabs(tabsData);

watchEffect(() => {
  entity.value = props.entity;
});
</script>

<template>
  <view v-if="entity" class="container !p-0">
    <view
      class="w-full bg-[#fff] transition-opacity duration-800 fixed top-0 left-0 z-999"
      :class="[showTopBar ? 'opacity-100' : 'opacity-0']"
      :style="{ height: statusBarHeight + miniAppNavHeight + 'px' }"
    ></view>

    <view
      class="fixed z-999 flex items-center"
      :style="{
        top: statusBarHeight + menuButtonInfo.height / 2 - backIconSize / 2 + 4 + 'px',
        left: `calc(100vw - ${menuButtonInfo.right}px)`
      }"
    >
      <MBack v-if="hasRouteControl" :size="backIconSize" />
      <view
        class="transition-opacity duration-800 text-18px text-[#0D0D26] font-semibold ml-8px"
        :class="[showTopBar ? 'opacity-100' : 'opacity-0']"
      >
        {{ !isSelf ? name : '我的' }}
      </view>
    </view>
    <view
      class="min-h-200px"
      :style="{
        background: 'linear-gradient(180deg, rgba(255, 255, 255, 0.6) 0%, rgba(250,250,250) 100%)',
        backdropFilter: 'blur(18px)',
        '-webkit-backdrop-filter': 'blur(18px)'
      }"
    >
      <MStatusBar static overflow-visible placeholder-height="0" :has-back="false">
        <view class="basic-info-wrapper">
          <EmployeeBasicInfo :model-value="entity" :is-self="isSelf" :click-callback="refreshEntity" />
        </view>
      </MStatusBar>
    </view>
    <view class="bg-wrapper">
      <MImage v-if="avatarKey" :src="avatarKey" class="bg-size" mode="scaleToFill" :style="{ width: windowWidth + 'px' }" />
      <view v-else class="bg-size bg-blue-400"></view>
    </view>

    <view v-if="entityId" class="p-15px pt-0 bg-light-200 min-h-[calc(100vh-200px+15px)]" :class="[hasFooter ? 'pb-94px' : '']">
      <MTabs
        v-model="currentTabValue"
        :items="tabs"
        :show-border-bottom="false"
        :active-style="{
          fontSize: '18px',
          color: '#333',
          'font-weight': '600'
        }"
        bg-color="rgba(250, 250, 250)"
        justify-content="flex-start"
        underline-width="18px"
        class="my-10px sticky z-1 left-0"
        :style="{ top: statusBarHeight + miniAppNavHeight + 'px' }"
      />
      <EmployeeAbout v-if="currentTabValue === 'about'" :entity="entity" :is-self="isSelf" @refresh="() => entityChangedKey++" />
      <EmployeeActivity v-else-if="currentTabValue === 'activity'" :entity-id="entityId" />
      <EmployeeEvaluation v-else-if="currentTabValue === 'evaluation'" :evaluations="evaluations" />
      <EmployeeWeekStatistics v-else-if="currentTabValue === 'statistics'" :entity-id="entityId" />
    </view>
  </view>
</template>

<style lang="scss">
.bg-wrapper {
  @apply w-full absolute top-0 -z-1;
  .bg-size {
    @apply w-full h-200px;
  }
}

.basic-info-wrapper {
  width: 100%;
  padding: v-bind('statusBarHeight + `px`') 15px 0;
}
</style>
