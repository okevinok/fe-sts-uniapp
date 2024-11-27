<script lang="ts" setup>
import { useUserStore } from '@/stores';

interface Props {
  userId?: string;
  placeholder?: string;
}

const emits = defineEmits<{
  (e: 'handleSelect', userId: string): void;
}>();

const props = defineProps<Props>();
const popup = ref();
const search = ref('');
const userStore = useUserStore();

const filteredUsers = computed(() => {
  return userStore.filterByName(search.value);
});

async function open() {
  popup.value?.open();
}

function close() {
  popup.value?.close();
}

const selectedUser = computed(() => userStore.getUserById(props.userId ?? ''));
const isShown = computed(() => !!popup.value?.showPopup);

defineExpose({
  open,
  isShown
});

async function handleSelect(user: UserModel.User) {
  emits('handleSelect', user.userId);
  close();
}
</script>

<template>
  <view>
    <view @click="open" class="flex items-center gap-2">
      <slot>
        <view class="flex items-center gap-2">
          <template v-if="selectedUser">
            <MAvatar :text="selectedUser.username" :src="selectedUser.avatar" :size="26" />
            <text>{{ selectedUser?.username }}</text>
          </template>

          <uni-icons v-else type="personadd" color="#9DA3AE" size="25" />
        </view>
      </slot>
    </view>

    <uni-popup ref="popup" type="bottom" :safe-area="false">
      <view class="popup-container">
        <view class="title">
          选择用户
          <uni-icons type="closeempty" @click="close" />
        </view>

        <view class="search-bar">
          <MSearchbar placeholder="搜索用户" v-model="search" bgColor="#f4f6f8" />
        </view>

        <scroll-view scroll-y :show-scrollbar="false" class="user-list">
          <template v-for="user in filteredUsers" :key="user.userId">
            <view class="user-item" @click="handleSelect(user)">
              <MAvatar :text="user?.username" :src="user?.avatar" :size="30" />

              <view class="name">
                {{ user.username }}
              </view>

              <uni-icons v-if="props.userId === user.userId" type="checkmarkempty" class="m-icon text-14px text-primary" />
            </view>
          </template>
        </scroll-view>
      </view>
    </uni-popup>
  </view>
</template>

<style lang="scss">
.popup-container {
  @apply bg-white h-85vh mx-2 flex flex-col;

  --safe-area-inset-bottom: env(safe-area-inset-bottom);
  padding-bottom: var(--safe-area-inset-bottom);
  border-radius: 16px 16px 0 0;

  .title {
    @apply px-10px pt-15px text-gray-700 text-16px flex justify-between items-center font-medium;
    flex-shrink: 0;
  }
  .search-bar {
    flex-shrink: 0;
    padding: 10px;
  }
}

.user-list {
  flex-grow: 1;
  height: calc(100% - 130px);

  --border-bottom: 1px solid #e9eae9a3;

  .user-item {
    @apply flex gap-2 items-center h-50px px-20px box-border bg-white;
    border-bottom: var(--border-bottom);

    .name {
      @apply flex-grow;
    }
  }
}
</style>
