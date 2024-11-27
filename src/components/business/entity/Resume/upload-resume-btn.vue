<script lang="ts">
export default { name: 'UploadResumeBtn', options: { virtualHost: true } };
</script>

<script lang="ts" setup>
import { useAuthStore } from '@/stores';
import { useRouter } from '@/hooks/useRouter';

type Props = {
  projectId?: string;
  projectName?: string;
};
const props = defineProps<Props>();

const authStore = useAuthStore();

const { canCreateMaterial } = authStore.authOf;
console.log('authStore.authOf', authStore.authOf, canCreateMaterial);
const router = useRouter();

function openUploadEntity() {
  router.push('/packages/entity/create/upload', { query: props });
}
</script>

<template>
  <view v-if="canCreateMaterial" class="float-btn__primary" @click.stop="openUploadEntity">导入简历</view>
</template>

<style lang="scss" scoped></style>
