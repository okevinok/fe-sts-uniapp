<script lang="ts" setup>
import Tags from '@/components/business/flow/tags.vue';
import MTag from '@/components/basic/MTag.vue';
import { useRouter } from '@/hooks/useRouter';
import { formatPathValue } from '@/utils/format';
import { loadingModal } from '@/utils/common';
import { entityService } from '@/services/entity';
import { getKeyById } from '@/config/entity/SystemEmployee/index';
import { set } from 'lodash-es';

const props = defineProps<{
  entity: EntityModel.BusinessEntity<'SystemEmployee'>;
  isSelf: boolean;
}>();

const emits = defineEmits<{
  (e: 'refresh'): void;
}>();

const router = useRouter();

const ENTITY_TYPE = 'SystemEmployee';

const standardFields = computed(() => props.entity?.data.standardFields);
const tags = computed(() => standardFields.value.tags || []);
const concernInfo = computed(() => standardFields.value.employeeInfo?.concernInfo || {});

const editModel = ref(standardFields.value);
watch(
  standardFields,
  (val) => {
    editModel.value = val;
  },
  { deep: true }
);

async function handlePatchEntity() {
  try {
    loadingModal.show({ title: '提交中', mask: true });
    console.log('editModel.value :>> ', editModel.value);
    await entityService.patchEntity(ENTITY_TYPE, {
      data: { standardFields: editModel.value },
      openId: props.entity.meta.openId
    });
    emits('refresh');
  } catch (error) {
    console.log(error);
  } finally {
    loadingModal.hide();
  }
}

function handleOpenAbilityDetail() {
  router.push('/packages/common/long-text', {
    data: {
      value: standardFields.value.selfEvaluation,
      disabled: !props.isSelf,
      cb: (val: string) => {
        if (editModel.value.selfEvaluation === val) return;
        editModel.value.selfEvaluation = val;
        handlePatchEntity();
      }
    }
  });
}

function toSelectorPage(id: DictionaryModel.DictionaryId) {
  if (!props.isSelf) return;
  const key = getKeyById(id);
  const selectedItems = concernInfo.value?.[key] || [];

  router.push('/packages/common/selector', {
    query: { id },
    data: {
      isMultiple: true,
      selectedItems,
      cb: (val: string[]) => {
        set(editModel.value, `employeeInfo.concernInfo[${key}]`, val);
        handlePatchEntity();
      }
    }
  });
}
</script>

<template>
  <view class="w-full">
    <view v-if="standardFields.selfEvaluation" class="w-full text-14px mb-30px">
      <view class="w-full text-black opacity-70 leading-5 line-clamp-4" @click="handleOpenAbilityDetail">
        {{ standardFields.selfEvaluation }}
      </view>
      <!-- <view class="mt-4px font-bold text-primary" @click="handleOpenAbilityDetail">Read more</view> -->
    </view>

    <view class="mb-30px">
      <view class="section-title">标签</view>
      <Tags :entity-id="entity.meta.openId" :entity-type="ENTITY_TYPE" :tags="tags" :can-edit="isSelf" @refresh="emits('refresh')">
        <view v-if="tags.length" class="mb-20px tags-wrapper">
          <MTag v-for="(item, i) in tags" :key="i" :style="item.style">{{ item.name }}</MTag>
        </view>
        <MTag v-else-if="isSelf">增加标签</MTag>
        <view v-else>暂无</view>
      </Tags>
    </view>

    <view class="mb-30px">
      <view class="section-title">关注的行业</view>
      <view v-if="concernInfo.industries?.length" class="tags-wrapper" @click="toSelectorPage('industry')">
        <MTag v-for="item in concernInfo.industries" :key="item" type="primary">{{ formatPathValue(item) }}</MTag>
      </view>
      <MTag v-else-if="isSelf" @click="toSelectorPage('industry')">增加行业</MTag>
      <view v-else>暂无</view>
    </view>

    <view class="mb-30px">
      <view class="section-title">关注的职能</view>
      <view v-if="concernInfo.categories?.length" class="tags-wrapper" @click="toSelectorPage('category')">
        <MTag v-for="item in concernInfo.categories" :key="item" type="primary">{{ formatPathValue(item) }}</MTag>
      </view>
      <MTag v-else-if="isSelf" @click="toSelectorPage('category')">增加职能</MTag>
      <view v-else>暂无</view>
    </view>
  </view>
</template>

<style lang="scss" scoped>
.section-title {
  margin-bottom: 12px;
  color: #333;
  font-size: 16px;
  font-weight: bold;
}

.tags-wrapper {
  @apply flex gap-10px flex-wrap;
}
</style>
