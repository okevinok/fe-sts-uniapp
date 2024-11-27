<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import Layout from '@/components/business/job-hopping/layout.vue';
import MButton from '@/components/basic/MButton.vue';
import { useWeightScore } from './hooks';
import { type BWeights, type BScores } from './type';
import { message } from '@/utils/common';

const scorePlaceholder = '请输入得分，-1至1';

const router = useRouter();

const weights = ref<BWeights>({
  b_salary_weight: null,
  b_career_weight: null,
  b_wl_balance_weight: null,
  b_life_persp_weight: null
});

const scores = ref<BScores>({
  b_salary_score: null,
  b_career_score: null,
  b_wl_balance_score: null,
  b_life_persp_score: null
});

const { handleReset, handleValidate, handleWeightInput } = useWeightScore(weights, scores);

function handleNext() {
  if (!weights.value || !scores.value) return;

  if (!handleValidate()) {
    return;
  }

  const scoresValues = Object.values(scores.value);

  const totalB = Object.entries(weights.value).reduce((sum, [k, weight], index) => {
    const score = Number(scoresValues[index] ?? 0);
    return sum + Number(weight ?? 0) * score;
  }, 0);

  if (totalB === 0) {
    return message.error('【跳槽回报率】不能为 0，因为无收益时跳槽无意义！');
  }

  router.push('/pages/index/ros', {
    data: {
      bWeights: weights.value,
      bScores: scores.value
    }
  });
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
      请输入你在b（跳槽回报率）
      各维度上的重要性和得分。重要性处于0-100%，所有维度重要性加总为100%。每个维度上具体得分区间为-1至1，越接近1越好。
    </view>
    <view class="section-title">b（跳槽回报率） - 工资收入增加</view>
    <view class="section-body">
      <view class="input-container">
        <input
          v-model="weights.b_salary_weight"
          type="number"
          placeholder="请输入比例"
          @input="handleWeightInput($event, 'b_salary_weight')"
        />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="scores.b_salary_score" :placeholder="scorePlaceholder" />
      </view>
    </view>
    <view class="section-title">b（跳槽回报率） - 技能/经验提升</view>
    <view class="section-body">
      <view class="input-container">
        <input
          v-model="weights.b_career_weight"
          type="number"
          placeholder="请输入比例"
          @input="handleWeightInput($event, 'b_career_weight')"
        />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="scores.b_career_score" :placeholder="scorePlaceholder" />
      </view>
    </view>
    <view class="section-title">b（跳槽回报率） - 工作生活平衡度</view>
    <view class="section-body">
      <view class="input-container">
        <input
          v-model="weights.b_wl_balance_weight"
          type="number"
          placeholder="请输入比例"
          @input="handleWeightInput($event, 'b_wl_balance_weight')"
        />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="scores.b_wl_balance_score" :placeholder="scorePlaceholder" />
      </view>
    </view>
    <view class="section-title">b（跳槽回报率） - 岗位受尊敬度</view>
    <view class="section-body">
      <view class="input-container">
        <input
          v-model="weights.b_life_persp_weight"
          type="number"
          placeholder="请输入比例"
          @input="handleWeightInput($event, 'b_life_persp_weight')"
        />
        <text class="suffix">%</text>
      </view>
      <view class="input-container">
        <input v-model="scores.b_life_persp_score" :placeholder="scorePlaceholder" />
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
