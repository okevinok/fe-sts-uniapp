<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { difyService, type KellyCriterionParams } from '@/services/dify';
import Layout from '@/components/business/job-hopping/layout.vue';
import MButton from '@/components/basic/MButton.vue';
import { useWeightScore } from './hooks';
import { type PWeights, type PScores, type BWeights, type BScores } from './type';

const weights = ref<PWeights>({
  p_stablecomp_weight: null,
  p_skill_weight: null,
  p_industry_weight: null,
  p_culture_weight: null
});

const scores = ref<PScores>({
  p_stablecomp_score: null,
  p_skill_score: null,
  p_industry_score: null,
  p_culture_score: null
});

interface RouterData {
  bWeights: BWeights;
  bScores: BScores;
}

const scorePlaceholder = '请输入得分，-1至1';

const router = useRouter<RouterData>();

const { handleReset, handleValidate, handleWeightInput } = useWeightScore(weights, scores);

async function handleNext() {
  if (!handleValidate() || !router.routerData) return;
  const { bWeights, bScores } = router.routerData;

  const allWeights = Object.entries({ ...bWeights, ...weights.value }).reduce((acc, [k, v]) => {
    acc[k] = Number(v) / 100;
    return acc;
  }, {} as Record<string, number>);

  const params = {
    ...Object.entries({ ...allWeights, ...bScores, ...scores.value }).reduce((acc, [key, value]) => {
      return {
        ...acc,
        [key]: Number(value) === 0 ? 0.000000001 : Number(value)
      };
    }, {} as Record<string, number>)
  } as KellyCriterionParams;

  console.log('params', params);

  try {
    const res = await difyService.getKellyCriterionScore(params);
    console.log('res', res);
    router.push('/pages/index/result', {
      data: { score: res.score }
    });
  } catch (error) {
    console.error(error);
  }
}
</script>

<template>
  <Layout>
    <view class="main-title">测试一下你是否应该离职？</view>
    <view class="my-4 card">
      这个公式经过拥有18年专业人才猎寻经验的人才咨询专家-猎头村村长
      Charlie加以完善和延伸，求职者可以根据自己跳槽后可能拿到的四个通用领域的潜在回报，且输入对不同回报的权重比例，然后再根据自身情况加入新企业后生存下来可能性，最后可以计算出选择跳槽成功的可能性有多大。
    </view>
    <view class="text-[#0B1526]">
      请输入你在p（跳槽后生存率）
      各维度上的重要性和得分。重要性处于0-100%，所有维度重要性加总为100%。每个维度上具体得分区间为-1至1，越接近1越好。
    </view>
    <view class="section-title">p（跳槽后生存概率） - 新公司文化匹配度</view>
    <view class="section-body">
      <view class="input-container">
        <input
          v-model="weights.p_stablecomp_weight"
          type="number"
          placeholder="请输入比例"
          @input="handleWeightInput($event, 'p_stablecomp_weight')"
        />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="scores.p_stablecomp_score" :placeholder="scorePlaceholder" />
      </view>
    </view>
    <view class="section-title">p（跳槽后生存概率） - 经验技能与岗位匹配度</view>
    <view class="section-body">
      <view class="input-container">
        <input
          v-model="weights.p_skill_weight"
          type="number"
          placeholder="请输入比例"
          @input="handleWeightInput($event, 'p_skill_weight')"
        />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="scores.p_skill_score" :placeholder="scorePlaceholder" />
      </view>
    </view>
    <view class="section-title">p（跳槽后生存概率） - 行业景气度</view>
    <view class="section-body">
      <view class="input-container">
        <input
          v-model="weights.p_industry_weight"
          type="number"
          placeholder="请输入比例"
          @input="handleWeightInput($event, 'p_industry_weight')"
        />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="scores.p_industry_score" :placeholder="scorePlaceholder" />
      </view>
    </view>
    <view class="section-title">p（跳槽后生存概率） - 新公司盈利能力</view>
    <view class="section-body">
      <view class="input-container">
        <input
          v-model="weights.p_culture_weight"
          type="number"
          placeholder="请输入比例"
          @input="handleWeightInput($event, 'p_culture_weight')"
        />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="scores.p_culture_score" :placeholder="scorePlaceholder" />
      </view>
    </view>

    <template #footer>
      <view class="w-full flex gap-4">
        <MButton type="default" size="middle" full-width @click="handleReset">页面重置</MButton>
        <MButton type="primary" size="middle" full-width @click="handleNext">下一步</MButton>
      </view>
    </template>
  </Layout>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>
