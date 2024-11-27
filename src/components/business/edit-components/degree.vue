<script lang="ts">
export default { name: 'Degree', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import MPopup from '@/components/basic/MPopup.vue';
import TagsSelect from './tags-select.vue';

type Props = {
  modelValue: Common.NormalizedField.Degree[] | undefined;
};
type Emits = {
  (e: 'update:modelValue', value: Props['modelValue']): void;
};
const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const data = ['专科', '本科', '硕士', '博士'];

const innerValue = ref<string[]>([props.modelValue?.[0]?.name || '']);
const popupRef = ref<InstanceType<typeof MPopup>>();

function open() {
  popupRef.value?.open();
}

watchEffect(() => {
  const value = innerValue.value[0] ? ([{ name: innerValue.value[0] }] as Common.NormalizedField.Degree[]) : [];
  emits('update:modelValue', value);
});

defineExpose({
  open
});
</script>

<template>
  <MPopup ref="popupRef" placement="bottom">
    <view class="min-h-20vh p-20px pt-10px">
      <view class="text-20px font-semibold text-[#333] mb-25px">请选择最低学历</view>
      <TagsSelect v-model="innerValue" :data="data" :is-single="true" />
    </view>
  </MPopup>
</template>

<style lang="scss" scoped></style>
