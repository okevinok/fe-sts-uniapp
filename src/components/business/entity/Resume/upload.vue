<script lang="ts" setup>
import { useRouter } from '@/hooks/useRouter';
import MButton from '@/components/basic/MButton.vue';
import MUpload from '@/components/basic/MUpload.vue';
import { entityService } from '@/services/entity';
import { getFileIcon } from '@/utils/file';
import { loadingModal } from '@/utils/common';
import { taskService } from '@/services/task';

type Props = {
  entityType?: EntityModel.BusinessEntityType;
  projectId?: string;
  projectName?: string;
  stageName?: string;
  successCb?: () => void;
};

type TempFile = { path: string; size: number; name: string; extname: string };
type UploadFile = Common.NormalizedField.File & {
  status?: 'loading' | 'success' | 'error';
  progress?: number;
  tempFile?: TempFile;
  result?: { entityId: string; taskId?: string };
};

const props = withDefaults(defineProps<Props>(), {
  entityType: 'Resume'
});

const MAX_LIMIT_COUNT = 20;

const { ...router } = useRouter();

const fileList = ref<UploadFile[]>([]);

const disableUpload = computed(() => fileList.value.length >= MAX_LIMIT_COUNT);

// 上传 -> 提交
async function handleUpload(files: TempFile[]) {
  try {
    loadingModal.show({ title: '上传中', mask: true });
    await Promise.allSettled(files.map((file, index) => handleUploadItem(file, fileList.value.length ?? 0 + index)));
    loadingModal.hide();
    props.successCb?.();
  } catch (err) {
    console.log(err);
  }
}

async function handleUploadItem(file: TempFile, index: number) {
  try {
    fileList.value[index] = {
      key: '',
      fileName: file.name,
      status: 'loading',
      tempFile: file
    };
    const entity = await entityService.upload({
      entityType: props.entityType,
      filePath: file.path,
      fileName: file.name,
      onUploadProgress(progressEvent) {
        fileList.value[index].progress = progressEvent.progress;
      }
    });
    const uploadedFile = entity.data.rawData?.files?.[0];
    if (uploadedFile) {
      fileList.value[index] = {
        key: uploadedFile.key,
        fileName: uploadedFile.fileName,
        result: { entityId: entity.meta.openId },
        status: 'success'
      };
    }
    if (props.projectId) {
      const task = await taskService.create({
        projectId: props.projectId,
        taskPayloadOpenId: entity.meta.openId,
        stageName: props.stageName
      });
      fileList.value[index].result!.taskId = task.meta.openId;
    }
  } catch (error) {
    fileList.value[index].status = 'error';
    console.log(error);
  }
}

function handleOpenResume(file: UploadFile) {
  if (file.status === 'success') {
    router.push(`/packages/entity/detail/index`, {
      query: { ...file.result, entityType: props.entityType }
    });
  }
}
</script>

<template>
  <view class="container has-footer bg-white">
    <uni-notice-bar :text="`简历建议使用PDF文件，也支持DOC、DOCX、JPG、PNG格式，大小不超过20M，一次最多上传${MAX_LIMIT_COUNT}份简历。`" />

    <view class="section pt-3">
      <view class="flex flex-col gap-3">
        <template v-for="(item, index) in fileList" :key="index">
          <view class="experience-card">
            <image class="h-40px w-40px flex-shrink-0" mode="heightFix" :src="getFileIcon(item.fileName)" />
            <view class="flex-1 flex-grow min-w-1">
              <view class="truncate mb-5px">{{ decodeURIComponent(item.fileName) }}</view>
              <view class="flex justify-between items-center">
                <text v-if="item.status === 'loading'" class="text-gray-500">{{ item.progress ?? 0 }}%</text>
                <template v-else-if="item.status === 'success'">
                  <uni-icons class="text-success m-icon text-18px" type="checkbox" />
                  <MButton type="primary" text @click="handleOpenResume(item)">查看人才</MButton>
                </template>
                <template v-else-if="item.status === 'error'">
                  <uni-icons class="text-danger m-icon text-18px" type="close" />
                  <MButton v-if="item.tempFile" type="error" text @click="handleUploadItem(item.tempFile, index)">重新上传</MButton>
                </template>
              </view>
            </view>
          </view>
        </template>
      </view>
    </view>

    <view class="m-footer flex-col">
      <MUpload class="w-full" file-type="doc" :handle-upload="handleUpload" mode="list" :limit="MAX_LIMIT_COUNT">
        <!-- #ifdef MP-WEIXIN -->
        <MButton class="submit w-full" full-width type="success" size="middle" :disabled="disableUpload">从微信聊天文件中上传</MButton>
        <!-- #endif -->
        <!-- #ifndef MP-WEIXIN -->
        <MButton class="submit w-full" full-width type="primary" size="middle" :disabled="disableUpload">上传新附件</MButton>
        <!-- #endif -->
      </MUpload>

      <slot name="buttons"></slot>
    </view>
  </view>
</template>

<style lang="scss">
@import '@/assets/styles/edit-page.scss';

// 组件内部不生效？
// :deep(.uni-file-picker__lists) {
//   display: none !important;
// }

.experience-card {
  @apply flex justify-between justify-start gap-3 p-15px rounded-lg bg-white h-70px box-border;
  border: 1px solid #e5e7eb;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.03);
}
</style>
