<script lang="ts" setup>
interface Emits {
  (e: 'handleConfirm', value: string): void;
}

const popup = ref();
const emits = defineEmits<Emits>();
const content = ref('');

async function open() {
  content.value = '';
  popup.value?.open();
}

function close() {
  popup.value?.close();
}

function handleConfirm() {
  emits('handleConfirm', content.value);
  close();
}

const keyBoardHeight = ref('0px');
const keyBoardHeightDuration = ref('0.25s');

function handleKeyboardShow(e: any) {
  const saveBottom = uni.getSystemInfoSync().safeAreaInsets?.bottom ?? 0;
  const _height = e.detail.height;
  const _duration = e.detail.duration;

  const height = (_height ? _height - saveBottom + 15 : 0) + 'px';
  const duration = _duration + 's !important';

  keyBoardHeight.value = height;
  if (e.detail.duration) {
    keyBoardHeightDuration.value = duration;
  }
}
</script>

<template>
  <view>
    <view @click="open">
      <slot />
    </view>

    <uni-popup ref="popup" type="bottom" :safe-area="false">
      <view class="popup-container">
        <view class="title">
          添加备注
          <uni-icons type="closeempty" @click="close" />
        </view>

        <textarea
          v-model="content"
          class="textarea"
          placeholder-style="color:#e1e1e3"
          :maxlength="999"
          placeholder="请输入..."
          :adjust-position="false"
          :show-confirm-bar="false"
          @keyboardheightchange="handleKeyboardShow"
        />

        <view class="submit-btn" @click="handleConfirm">提交</view>

        <view
          class="transition transition-all w-full"
          :class="keyBoardHeight ? `ease-out` : `ease-in`"
          :style="{
            height: keyBoardHeight,
            transitionDuration: keyBoardHeightDuration
          }"
        />
      </view>
    </uni-popup>
  </view>
</template>

<style lang="scss" scoped>
.popup-container {
  @apply bg-white mx-2 flex flex-col p-15px;

  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  padding-bottom: var(--safe-area-inset-bottom);
  border-radius: 16px 16px 0 0;

  .title {
    @apply text-gray-700 text-16px flex justify-between items-center font-medium;
    flex-shrink: 0;
  }
}

.textarea {
  @apply my-10px w-full border-none;
  line-height: 1.5;
  max-height: 60px;
}

.submit-btn {
  @apply h-35px rounded-lg text-primary flex justify-center items-center text-14px font-medium;
  background-color: #42679511;
}
</style>
