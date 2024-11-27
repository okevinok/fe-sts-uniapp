<script lang="ts">
export default { name: 'JdEdit', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import { aiToolsService } from '@/services/ai-tools';
import { message } from '@/utils/common';
import { useRequest } from '@/hooks/useRequest';

type Props = {
  modelValue: string | undefined;
  jobName?: string;
  keywords?: string[];
};
type Emits = {
  (e: 'update:modelValue', value: Props['modelValue']): void;
};
const props = defineProps<Props>();
const emits = defineEmits<Emits>();

const model = ref('');

const { loading, refresh: generateJd } = useRequest(
  () =>
    aiToolsService.generateJobDescription({
      name: props.jobName as string,
      keywords: props.keywords
    }),
  {
    manual: true,
    onSuccess: (res) => {
      model.value = res.qualification;
    }
  }
);

function generateQualification() {
  if (!props.jobName) return message.info('请输入职位名称');
  generateJd();
}

watchEffect(() => {
  model.value = props.modelValue || '';
});

watchEffect(() => {
  emits('update:modelValue', model.value);
});
</script>

<template>
  <view class="edit-field is-column focus-none">
    <view class="label w-full items-center justify-between">
      <view class="">职位描述</view>
      <MButton :loading="loading" text @click="generateQualification">
        <view v-if="!loading" class="text-primary text-12px">
          <MIcon type="icon-moshubang" class="mr-1" />
          自动生成职位描述
        </view>
        <view v-else class="text-gray-400 text-12px">生成中...</view>
      </MButton>
    </view>

    <view class="m-textarea">
      <textarea
        v-model="model"
        :disabled="loading"
        class="min-h-120px"
        placeholder="请输入..."
        placeholder-class="m-textarea-placeholder"
        auto-height
        :maxlength="999"
      ></textarea>
    </view>
  </view>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/edit-page.scss';
</style>
