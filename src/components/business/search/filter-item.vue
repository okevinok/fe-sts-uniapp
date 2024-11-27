<script lang="ts" setup>
import { useRouter, type RouterUrl } from '@/hooks/useRouter';
import { isEqual, uniq } from 'lodash-es';
import { formatFilterNumberRange } from '@/utils/format';
import type { FilterOptionConfigValues, FilterOptionConfigValuesWithLabel, FilterOptionMode } from '@/config/search/filter';

type Props = {
  options: FilterOptionConfigValues;
  selectedValues?: SearchModel.FilterValueType[];
  toMorePage?: RouterUrl;
  dictionaryId?: DictionaryModel.DictionaryId;
  multiple?: boolean;
  foldable?: boolean;
  label?: string;
  unit?: string;
  mode?: FilterOptionMode;
};

type Emits = {
  (e: 'change', values: SearchModel.FilterValueType[]): void;
  (e: 'update:selectedValues', value: Props['options']): void;
};

const props = withDefaults(defineProps<Props>(), {
  multiple: true,
  foldable: false
});

const emits = defineEmits<Emits>();

const router = useRouter();

const COLLAPSED_ITEM_COUNT = 6;

const innerCheckedValues = ref(props.selectedValues || []);
watchEffect(() => (innerCheckedValues.value = props.selectedValues || []));

const innerOptions = computed(() => {
  const options = props.toMorePage ? props.options.slice(0, COLLAPSED_ITEM_COUNT - 1) : props.options;
  return props.toMorePage ? uniq([...options, ...innerCheckedValues.value]) : options;
});

const isFolded = ref(props.foldable);
const isDefaultChecked = ref(true);

watchEffect(() => {
  isDefaultChecked.value = !innerCheckedValues.value.length;
});

const isChecked = (value: Props['options'][number]) => {
  return innerCheckedValues.value.some((v) => isEqual(v, isComplexValue(value) ? value.value : value));
};

const isComplexValue = (value: Props['options'][number]): value is FilterOptionConfigValuesWithLabel =>
  typeof value === 'object' && 'value' in value;

const isRange = (item: SearchModel.FilterValueType): item is SearchModel.FilterValueRange =>
  typeof item === 'object' && ('minimum' in item || 'maximum' in item);

const getOptionLabel = (item: Props['options'][number]) => {
  if (isComplexValue(item)) {
    if (item.label) return item.label || item.value;
    if (isRange(item.value)) return formatFilterNumberRange(item.value);
  } else {
    if (isRange(item)) return formatFilterNumberRange(item);
    return item;
  }
};

function handleDefaultChecked(checked: boolean) {
  if (checked) {
    innerCheckedValues.value = [];
    emits('change', innerCheckedValues.value);
  }
}

function handleCheckedValue(item: Props['options'][number], checked: boolean) {
  console.log(item, checked);
  const _item = isComplexValue(item) ? item.value : item;

  if (!props.multiple) {
    innerCheckedValues.value = [_item];
  } else {
    if (checked) {
      innerCheckedValues.value.push(_item);
    } else {
      innerCheckedValues.value = innerCheckedValues.value.filter((v) => !isEqual(v, _item));
    }
  }
  emits('change', innerCheckedValues.value);
}

function handleToMorePage() {
  if (!props.toMorePage) return;

  router.push(props.toMorePage, {
    query: {
      label: props.label,
      id: props.dictionaryId
    },
    data: {
      isMultiple: props.multiple,
      items: props.dictionaryId ? [] : props.options,
      selectedItems: innerCheckedValues.value,
      cb: (val: SearchModel.FilterValueType[]) => {
        innerCheckedValues.value = val;
        emits('change', innerCheckedValues.value);
      }
    }
  });
}

const startTime = ref('');
const endTime = ref('');

watch(startTime, (val) => {
  console.log('startTime', val);
  handleRangeValuesChange(val, 'minimum');
});
watch(endTime, (val) => {
  console.log('endTime', val);
  handleRangeValuesChange(val, 'maximum');
});

watchEffect(() => {
  if (isRange(innerCheckedValues.value[0])) {
    const { minimum, maximum } = innerCheckedValues.value[0];
    console.log(minimum, maximum);
    minimum && (startTime.value = minimum as string);
    maximum && (endTime.value = maximum as string);
  }
});

function handleRangeValuesChange(value: string, key: keyof SearchModel.FilterValueRange) {
  if (!innerCheckedValues.value.length || !Object.keys(innerCheckedValues.value[0]).length) {
    innerCheckedValues.value[0] = { [key]: value };
  } else if (isRange(innerCheckedValues.value[0])) {
    innerCheckedValues.value[0][key] = value || undefined;
  }
  innerCheckedValues.value = innerCheckedValues.value.filter((item) => Object.values(item).some(Boolean));
  emits('change', innerCheckedValues.value);
}
</script>

<template>
  <view class="relative">
    <view class="header">
      <view class="header-title">{{ label }}</view>
      <view v-if="toMorePage" @click="handleToMorePage" class="header-btn">更多</view>
      <view v-else-if="foldable && innerOptions.length > COLLAPSED_ITEM_COUNT" class="header-btn" @click="isFolded = !isFolded">
        {{ isFolded ? '展开' : '收起' }}
      </view>
    </view>

    <view class="body">
      <MDateRangePicker v-if="mode === 'dateRange'" v-model:start-time="startTime" v-model:end-time="endTime" />
      <view v-else class="options">
        <MCheckTag class="option" :checked="isDefaultChecked" rounded="sm" @change="handleDefaultChecked">不限</MCheckTag>
        <MCheckTag
          v-for="(item, index) in innerOptions"
          v-show="isFolded ? index < COLLAPSED_ITEM_COUNT - 1 : true"
          class="option"
          rounded="sm"
          :key="index"
          :checked="isChecked(item)"
          @change="(checked) => handleCheckedValue(item, checked)"
        >
          <view class="truncate">
            {{ getOptionLabel(item) }}
          </view>
        </MCheckTag>
      </view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.header {
  @apply sticky top-0 z-1 py-5px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: $uni-bg-color;

  &-title {
    font-size: 16px;
    font-weight: 500;
  }

  &-btn {
    @apply py-4px px-8px text-14px text-grey-60;
  }
}

.body {
  padding-top: 18px;
}

.options {
  @apply flex flex-wrap;

  .option {
    @apply text-center;
    width: calc(50% - 14px);
    margin-right: 14px;
    margin-bottom: 20px;
  }
}
</style>
