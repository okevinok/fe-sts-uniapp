<script lang="ts">
export default { name: 'ContactsItem' };
</script>

<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import { THEME_COLOR } from '@/config';

type Props = {
  data: EntityModel.BusinessEntity<'Contacts'>;
  entityType: EntityModel.EntityType;
  clickCallback?: (item: Props['data']) => void;
};

const props = defineProps<Props>();

const router = useRouter();

const standardFields = computed(() => props.data.data.standardFields);

const meta = computed(() =>
  [
    { value: standardFields.value.companyName },
    { value: standardFields.value.emails?.[0] },
    { value: standardFields.value.incomingAddress }
  ].filter((item) => item.value)
);

function handleClick() {
  // TODO
  // router.push('/packages/entity/detail/index', {
  //   query: {
  //     entityType: props.entityType,
  //     entityId: props.data.meta.openId
  //   }
  // });
}

function call(phoneNumber: string) {
  uni.makePhoneCall({ phoneNumber });
}
</script>

<template>
  <uni-list-item class="list-item" direction="column" :border="false" clickable @click="handleClick">
    <template #header>
      <view class="flex justify-between items-center mb-10px">
        <view class="text-16px text-dark-600 truncate">{{ standardFields?.name }}</view>
        <uni-icons
          v-if="standardFields?.phoneNumber"
          type="phone"
          size="18"
          :color="THEME_COLOR"
          @click.stop="call(standardFields?.phoneNumber)"
        />
      </view>
    </template>
    <template #body>
      <view class="flex justify-between flex-col gap-2 text-12px text-gray-600">
        <view v-for="item in meta" :key="item.value" class="leading-[1.2]">{{ item.value }}</view>
      </view>
    </template>
  </uni-list-item>
</template>

<style lang="scss" scoped></style>
