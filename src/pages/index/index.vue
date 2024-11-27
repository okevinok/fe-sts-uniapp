<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import Layout from '@/components/business/job-hopping/layout.vue';

const router = useRouter();

function handleStart() {
  router.push('/pages/index/ror');
}
</script>

<template>
  <Layout>
    <view class="main-title">凯利公式</view>
    <view class="text-sm mt-4">
      凯利公式（The Kelly
      Criterion）是由约翰·凯利于1956年提出的投注策略。公式指出了在一个期望收益为正的重复性赌局或者资管性投资中，每一期应该下注的最优比例。通过延伸，这个公式可以用来比较分析员工在面对一个重要变动决策的跳槽机会时，左右着了新工作带给自己在以下四个通用领域的可能回报(如果选择跳槽):
    </view>
    <view class="mt-1 text-sm">
      <view>1) 工资收入的增加</view>
      <view>2) 工作生活平衡度</view>
      <view>3) 技能/经验提升</view>
      <view>4) 职位提高后受尊敬度</view>
    </view>
    <view class="mt-1 text-sm">再结合自身通过的需要考虑的匹配/熟悉程度(匹配/熟悉程度越高，员工在跳槽后越容易成功-成功率):</view>
    <view>A) 新公司文化匹配度</view>
    <view>B) 技能技能与岗位匹配度</view>
    <view>C) 行业景气度</view>
    <view>D) 新公司盈利能力</view>

    <view class="mt-5 card">
      <view class="text-center text-sm text-[#FF8A34]">f*=(bp-q)/b=(p(b+1)-1)/b</view>
      <view class="text-center text-xs mt-2 text-gray-500">
        f*为跳槽最整体成功概率，p为跳槽后生存概率，q为跳槽后的失败概率，b为跳槽回报率
      </view>
    </view>

    <template #footer>
      <MButton type="primary" size="middle" full-width @click="handleStart">即刻开始</MButton>
    </template>
  </Layout>
</template>

<style lang="scss" scoped>
@import './style.scss';
</style>
