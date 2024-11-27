<script lang="ts">
export default { name: 'UserBasicInfo', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import { useUserStore, useAuthStore } from '@/stores';

type Props = {
  /** 如果传 id，优选根据 id 获取用户信息 */
  userId?: string;
  user?: UserModel.User;
};

const props = defineProps<Props>();

const userStore = useUserStore();
const authStore = useAuthStore();

const _user = ref(props.user);

const isSelf = computed(() => props.userId === authStore.user?.userId);
const avatar = computed(() => (isSelf.value ? authStore.user?.avatar : _user.value?.avatar));
const name = computed(() => (isSelf.value ? authStore.user?.username : _user.value?.username) || '-');

watch(
  () => props.userId,
  async (id) => {
    if (!id) return;
    const user = userStore.getUserById(id);
    if (user) {
      _user.value = user;
    } else {
      // await userStore.fetchUsers([id]);
      // _user.value = userStore.getUserById(id);
    }
  },
  { immediate: true }
);
</script>

<template>
  <view class="user-info">
    <MAvatar :src="avatar" :size="20" />
    <view class="user-name">{{ name }}</view>
  </view>
</template>

<style lang="scss" scoped>
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  .user-name {
    font-size: 12px;
    // color: $uni-text-color-grey;
  }
}
</style>
