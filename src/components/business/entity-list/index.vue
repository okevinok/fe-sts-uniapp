<script lang="ts" setup>
import JobItem from './components/Job.vue';
import ResumeItem from './components/Resume.vue';
import BusinessPartnerItem from './components/BusinessPartner.vue';
import ContractItem from './components/Contract.vue';
import InvoiceItem from './components/Invoice.vue';
import SystemEmployeeItem from './components/SystemEmployee.vue';
import ActivityItem from './components/Activity.vue';
import ContactsItem from './components/Contacts.vue';
import JobOpportunitiesItem from './components/JobOpportunities.vue';
import PosterItem from './components/Poster.vue';
import { template } from 'lodash-es';

type Props = {
  entityType: EntityModel.EntityType;
  list: (ProjectModel.Project | TaskModel.Task | EntityModel.BusinessEntity)[];
  loadMoreStatus?: string;
  clickCallback?: (item: Props['list'][number]) => void;
};

const props = defineProps<Props>();

const entityType = computed(() => {
  if (props.entityType === 'Project') return (props.list?.[0] as ProjectModel.Project)?.projectPayload?.entityType;
  else if (props.entityType === 'HydrogenTask') return (props.list?.[0] as TaskModel.Task)?.taskPayload?.entityType;
  else return props.entityType;
});
</script>

<template>
  <uni-list class="m-list" :border="false">
    <template v-if="entityType === 'Resume'">
      <ResumeItem
        v-for="item in (list as (EntityModel.BusinessEntity<'Resume'> | TaskModel.Task<'Resume'>)[])"
        :key="item.meta.openId"
        :data="item"
        :entity-type="entityType"
        :clickCallback="clickCallback"
      />
    </template>
    <template v-else-if="entityType === 'Job'">
      <JobItem
        v-for="item in (list as (ProjectModel.Project<'Job'> | EntityModel.BusinessEntity<'Job'>)[])"
        :key="item.meta.openId"
        :data="item"
        :entity-type="entityType"
        :clickCallback="clickCallback"
      />
    </template>
    <template v-else-if="entityType === 'BusinessPartner'">
      <BusinessPartnerItem
        v-for="item in (list as (EntityModel.BusinessEntity<'BusinessPartner'>[]))"
        :key="item.meta.openId"
        :data="item"
        :entity-type="entityType"
        :clickCallback="clickCallback"
      />
    </template>
    <template v-else-if="entityType === 'Contract'">
      <ContractItem
        v-for="item in (list as (EntityModel.BusinessEntity<'Contract'>[]))"
        :key="item.meta.openId"
        :data="item"
        :entity-type="entityType"
        :clickCallback="clickCallback"
      />
    </template>
    <template v-else-if="entityType === 'Invoice'">
      <InvoiceItem
        v-for="item in (list as (EntityModel.BusinessEntity<'Invoice'>[]))"
        :key="item.meta.openId"
        :data="item"
        :entity-type="entityType"
        :clickCallback="clickCallback"
      />
    </template>
    <template v-else-if="entityType === 'SystemEmployee'">
      <SystemEmployeeItem
        v-for="item in (list as (EntityModel.BusinessEntity<'SystemEmployee'>[]))"
        :key="item.meta.openId"
        :data="item"
        :entity-type="entityType"
        :clickCallback="clickCallback"
      />
    </template>
    <template v-else-if="entityType === 'Activity'">
      <ActivityItem
        v-for="item in (list as (ProjectModel.Project<'Activity'> | EntityModel.BusinessEntity<'Activity'>)[])"
        :key="item.meta.openId"
        :data="item"
        :entity-type="entityType"
        :clickCallback="clickCallback"
      />
    </template>
    <template v-else-if="entityType === 'JobOpportunities'">
      <JobOpportunitiesItem
        v-for="item in (list as EntityModel.BusinessEntity<'JobOpportunities'>[])"
        :key="item.meta.openId"
        :data="item"
        :entity-type="entityType"
        :clickCallback="clickCallback"
      />
    </template>
    <template v-else-if="entityType === 'Contacts'">
      <ContactsItem
        v-for="item in (list as (EntityModel.BusinessEntity<'Contacts'>[]))"
        :key="item.meta.openId"
        :data="item"
        :entity-type="entityType"
        :clickCallback="clickCallback"
      />
    </template>
    <template v-else-if="entityType === 'Poster'">
      <PosterItem
        v-for="item in (list as (EntityModel.BusinessEntity<'Poster'>[]))"
        :key="item.meta.openId"
        :data="item"
        :entity-type="entityType"
        :clickCallback="clickCallback"
        class="poster-item"
      />
    </template>

    <!-- default -->
    <template v-else v-for="item in list as EntityModel.BusinessEntity[]">
      <slot name="default" :item="item as any">
        <uni-list-item class="list-item" direction="column" :border="false" @click="clickCallback?.(item)" clickable>
          <template #header>
            <view class="text-14px truncate text-[#333]">{{ item?.data?.standardFields?.name }}</view>
          </template>
        </uni-list-item>
      </slot>
    </template>
  </uni-list>

  <uni-load-more :status="loadMoreStatus" />
</template>

<style lang="scss" scoped></style>
