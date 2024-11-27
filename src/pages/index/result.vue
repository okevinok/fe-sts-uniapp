<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import Layout from '@/components/business/job-hopping/layout.vue';
import MButton from '@/components/basic/MButton.vue';
import { withCdnPrefix } from '@/utils/file';

type RouterData = {
  score: number;
};

const router = useRouter<RouterData>();
const score = ref(router.routerData?.score ?? 0.49);

function getScoreResult(score: number): { text: string; color: string } {
  if (score >= 0.9) return { text: '我们建议您可以安心跳槽', color: '#22c55e' };
  if (score >= 0.8) return { text: '我们建议您可以顺利跳槽', color: '#14b8a6' };
  if (score >= 0.5)
    return {
      text: '我们建议您可以跳槽，但可能需要付出一些努力和准备。',
      color: '#f97316'
    };
  if (score >= 0.3) return { text: '我们建议您慎重考虑跳槽。', color: '#eab308' };
  return { text: '我们不建议您此时跳槽。', color: '#FF4D4F' };
}

const scoreResult = computed(() => getScoreResult(score.value));
const showOfficialAccount = ref(false);

function handleSubscribe() {
  showOfficialAccount.value = true;
}

function onOfficialAccountLoad(e: any) {
  console.log('official-account load success', e);
}

function onOfficialAccountError(e: any) {
  console.log('official-account load error', e);
}
</script>

<template>
  <Layout>
    <view class="flex flex-col items-center">
      <!-- <MImage :src="withCdnPrefix('/custom/cgl/assets/job-hopping/trophy.png')" width="234px" height="159px"></MImage> -->
      <view class="text-xl font-bold mt-4">评估得分</view>
      <view class="text-6xl font-bold mt-4" :style="{ color: scoreResult.color }">
        {{ score.toFixed(2) }}
      </view>
    </view>
    <view class="mt-8 text-[#356899]">
      <view class="text-center">根据公式推演，{{ scoreResult.text }}</view>
      <view class="mt-3 text-center">
        <view class="">请关注公众号"猎头村村长频道"回复"神州猎测评"</view>
        <view>获得详细解读</view>
        <!-- <MButton class="mt-4" type="primary" size="middle" @click="handleSubscribe">关注公众号</MButton> -->
      </view>

      <official-account v-if="showOfficialAccount" class="mt-4" @load="onOfficialAccountLoad" @error="onOfficialAccountError" />
    </view>
  </Layout>
</template>

<style lang="scss" scoped>
:deep(.official-account) {
  width: 90%;
  margin: 0 auto;
}
</style>
