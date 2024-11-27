<script lang="ts">
export default { name: 'NumberRangeInput', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import MPopup from '@/components/basic/MPopup.vue';

type Props = {
  modelValue?: Common.NormalizedField.IntRange;
};
type Emits = {
  (e: 'update:modelValue', value: Props['modelValue']): void;
};
const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const popupRef = ref<InstanceType<typeof MPopup>>();

const innerValue = reactive({
  gt: props.modelValue?.gt,
  lt: props.modelValue?.lt
});

const keyboardHeight = ref(0);

function open() {
  popupRef.value?.open();
}

function onKeyboardHeightChange(e: { detail: { height: number } }) {
  console.log('onKeyboardHeightChange :>> ', e);
  keyboardHeight.value = e.detail.height;
}

watchEffect(() => {
  innerValue.gt = props.modelValue?.gt;
  innerValue.lt = props.modelValue?.lt;
});

watch(innerValue, (val) => {
  const { gt, lt } = val;
  const value = {
    ...props.modelValue,
    gt: gt ? Number(gt) : undefined,
    lt: lt ? Number(lt) : undefined
  };
  console.log('value :>> ', value);
  emits('update:modelValue', value);
});

defineExpose({ open });
</script>

<template>
  <MPopup ref="popupRef" placement="bottom">
    <view
      class="px-20px pt-10px"
      :style="{
        paddingBottom: keyboardHeight ? keyboardHeight + 30 + 'px' : '30px'
      }"
    >
      <view class="text-20px font-semibold text-[#333] mb-25px">工作年数偏好</view>
      <view class="flex justify-between items-center text-16px">
        <view class="text-center">
          <input
            v-model="innerValue.gt"
            type="number"
            placeholder="请输入下限"
            :adjust-position="false"
            @keyboardheightchange="onKeyboardHeightChange"
          />
        </view>
        <view class="w-80px text-center">-</view>
        <view class="text-center">
          <input
            v-model="innerValue.lt"
            type="number"
            placeholder="请输入上限"
            :adjust-position="false"
            @keyboardheightchange="onKeyboardHeightChange"
          />
        </view>
      </view>
    </view>
  </MPopup>
</template>

<style lang="scss" scoped></style>
