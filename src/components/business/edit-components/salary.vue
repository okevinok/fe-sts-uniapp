<script lang="ts" setup>
import Display from './field-display.vue';
import { salaryType } from '@/services/dictionary';
import { isEqual, groupBy, max } from 'lodash-es';
import { formatSalaryRange } from '@/utils/format';

type Props = {
  modelValue: any;
  title?: string;
  subTitle?: string;
  fixedTab?: string;
  isArray?: boolean;
};

type Emits = {
  (e: 'update:modelValue', value: Props['modelValue']): void;
};

const props = defineProps<Props>();
const emits = defineEmits<Emits>();
const popupRef = ref();
const isOpen = ref(false);
const swiper = ref();
const groups = groupBy(salaryType, 'periodLabel');
const currentTab = ref(props.fixedTab ?? '月薪');

/** 外部手动打开 */
function openPopup() {
  popupRef.value?.open();
}

function handleClosePopup() {
  popupRef.value?.close();
}

function onPopupChange(e: { show: boolean }) {
  isOpen.value = e.show;
}

function handleSelect(value: Common.NormalizedField.SalaryRange | null) {
  if (value) {
    emits('update:modelValue', props.isArray ? [value] : value);
  } else {
    // 如果选择了空值，is Array 就改成【】，否则改成 null
    emits('update:modelValue', props.isArray ? [] : null);
  }
  handleClosePopup();
}

const currentSalaryValue = computed(() => {
  console.log('props.modelValue :>> ', props.modelValue);
  const salaryRangeVal = props.isArray ? props.modelValue[0] : props.modelValue;
  const type = salaryType.find((type) => {
    return isEqual(type.value, salaryRangeVal);
  });
  return type;
});

function handleSwiperChange(e: any) {
  const id = e.detail.currentItemId;
  currentTab.value = id;
}

defineExpose({ isOpen, openPopup });
</script>

<template>
  <view class="flex-grow flex justify-end">
    <view class="flex gap-1 items-center pb-1px">
      <uni-tag
        v-if="!props.fixedTab && modelValue[0]"
        size="small"
        :text="currentSalaryValue?.periodLabel"
        circle
        inverted
        class="flex-shrink-0"
      />
      <Display :model-value="formatSalaryRange(currentSalaryValue?.value)" placeholder="面议" />
    </view>

    <uni-popup ref="popupRef" type="bottom" :safeArea="false" @change="onPopupChange">
      <view class="popper">
        <!-- 标题 -->
        <view class="flex justify-between items-start mb-12px" @click.stop>
          <view class="flex flex-col gap-2">
            <view class="text-16px font-medium">{{ props.title }}</view>
            <view class="text-12px text-gray-400" v-if="props.subTitle">{{ props.subTitle }}</view>
          </view>
          <uni-icons type="closeempty" @click="handleClosePopup"></uni-icons>
        </view>

        <!-- Tab bar -->
        <view v-if="!props.fixedTab" class="flex gap-30px items-center mb-3">
          <view
            class="indicator"
            :class="currentTab === key && `active`"
            v-for="(_, key) in groups"
            :key="key"
            @click="currentTab = key.toString()"
          >
            {{ key }}
          </view>
        </view>

        <!-- 薪资内容 -->
        <swiper class="h-400px" ref="swiper" :autoplay="false" @change="handleSwiperChange" :current-item-id="currentTab">
          <template v-for="(section, period) in groups" :key="period">
            <!-- 如果传了fixedTab，则只有一个类型的薪资范围（e.g. 月薪） -->
            <swiper-item :item-id="period" v-if="props.fixedTab ? period === props.fixedTab : true">
              <view class="flex flex-col">
                <!-- 没有值就是默认面议 -->
                <view class="select-item" :class="!currentSalaryValue && `selected`" @tap="handleSelect(null)">
                  <view>面议</view>
                  <uni-icons v-if="!currentSalaryValue" type="checkmarkempty" color="#ff7d04" />
                </view>
                <view
                  v-for="item in section"
                  :key="item.label"
                  class="select-item"
                  :class="item === currentSalaryValue && `selected`"
                  @tap="handleSelect(item.value)"
                >
                  <view>{{ formatSalaryRange(item.value) }}</view>
                  <uni-icons v-if="item === currentSalaryValue" type="checkmarkempty" color="#ff7d04" />
                </view>
              </view>
            </swiper-item>
          </template>
        </swiper>
      </view>
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped>
.indicator {
  @apply py-1 min-w-20px transition text-15px relative;

  &.active {
    color: $uni-color-primary;
    &::after {
      content: '';
      display: block;
      width: 100%;
      height: 3px;
      border-radius: 100px;
      position: absolute;
      bottom: -5px;
      background-color: $uni-color-primary;
    }
  }
}

.select-item {
  @apply flex justify-between items-center h-50px text-16px box-border;
  &:not(:last-child) {
    border-bottom: 0.5px solid $uni-bg-color-hover;
  }
  &.selected {
    color: $uni-color-primary;
    font-weight: 500;
  }
}

.popper {
  @apply bg-white p-5;
  border-top-right-radius: 16px;
  border-top-left-radius: 16px;
}
</style>
