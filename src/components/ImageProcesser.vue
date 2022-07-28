<template>
  <div class="image-processer">
    <a-modal
      title="裁剪图片"
      v-model:visible="showModal"
      @ok="handleOk"
      @cancel="showModal = false"
      okText="确认"
      cancelText="取消"
    >
      <div class="image-cropper">
        <img v-if="dataBase64" :src="dataBase64" alt="" />
        <img :src="baseImageUrl" id="processed-image" ref="cropperImg" />
      </div>
    </a-modal>
    <!-- <div
      class="image-preview"
      :style="{ backgroundImage: backgrondUrl }"
      :class="{ extraHeight: showDelete }"
    ></div> -->
    <div class="image-process">
      <div class="image-button">
        <styled-uploader @success="handleFileUploaded"></styled-uploader>
        <a-button class="btn-clazz" @click="showModal = true">
          <template v-slot:icon><ScissorOutlined /></template>裁剪图片
        </a-button>
        <a-button
          v-if="showDelete"
          class="btn-clazz"
          type="danger"
          @click="handleDelete"
        >
          <template v-slot:icon><DeleteOutlined /></template>删除图片
        </a-button>
      </div>
      <a-input
        :value="value"
        placeholder="请输入"
        @input="handleInputChange($event)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, watch, nextTick } from 'vue'
import { message } from 'ant-design-vue'
import Cropper from 'cropperjs'
import { DeleteOutlined, ScissorOutlined } from '@ant-design/icons-vue'
import StyledUploader from '@/components/StyleUploader.vue'
import { UploadResp } from '@/types/extraType'
interface CropDataProps {
  x: number
  y: number
  width: number
  height: number
}

export default defineComponent({
  props: {
    value: {
      type: String,
      required: true,
    },
    ratio: {
      type: Number,
    },
    showDelete: {
      type: Boolean,
      default: false,
    },
  },
  components: {
    DeleteOutlined,
    StyledUploader,
    ScissorOutlined,
  },
  emits: ['change', 'uploaded'],
  setup(props, context) {
    const showModal = ref(false)
    const backgrondUrl = computed(() => `url(${props.value})`)
    const baseImageUrl = computed<string>(() => props.value.split('?')[0])
    const cropperImg = ref<null | HTMLImageElement>(null)
    const dataBase64 = ref<null | string>(null)
    let cropper: Cropper
    let cropData: CropDataProps | null = null
    watch(showModal, async (newValue) => {
      if (newValue) {
        await nextTick()
        if (cropperImg.value) {
          cropper = new Cropper(cropperImg.value, {
            crop(event) {
              const { x, y, width, height } = event.detail
              cropData = {
                x: Math.floor(x),
                y: Math.floor(y),
                width: Math.floor(width),
                height: Math.floor(height),
              }
            },
          })
        }
      } else {
        if (cropper) {
          cropper.destroy()
        }
      }
    })
    const handleOk = () => {
      if (cropData) {
        const { x, y, width, height } = cropData
        // 使用云服务的方法
        const cropperURL =
          baseImageUrl.value +
          `?x-oss-process=image/crop,x_${x},y_${y},w_${width},h_${height}`
        // 不使用 云服务 ，拿到截图图片再次上传的处理方法
        dataBase64.value = cropper.getCroppedCanvas().toDataURL()
        // cropper.getCroppedCanvas().toBlob((blob) => {
        //   if (blob) {
        //     const formData = new FormData()
        //     formData.append('croppedImage', blob, 'test.png')
        //     axios.post('http://local.test:7001/api/upload/', formData, {
        //       headers: {
        //         'Content-Type': 'multipart/form-data'
        //       }
        //     }).then(resp => {
        //       context.emit('change', resp.data.data.url)
        //       showModal.value = false
        //     })
        //   }
        // })
        console.log(cropperURL, 'cropperURL')
        context.emit('change', cropperURL)
      }
      showModal.value = false
    }
    const handleFileUploaded = (data: { resp: any; file: File }) => {
      const { resp } = data
      message.success('上传成功')
      context.emit('change', resp.data.urls[0])
      context.emit('uploaded', data)
    }
    const handleDelete = () => {
      context.emit('change', '')
    }

    const handleInputChange = (e: Event) => {
      context.emit('change', (e.target as HTMLInputElement).value)
    }
    return {
      handleFileUploaded,
      handleDelete,
      backgrondUrl,
      showModal,
      cropperImg,
      handleOk,
      handleInputChange,
      baseImageUrl,
      dataBase64,
    }
  },
})
</script>

<style>
.image-processer {
  display: flex;
  justify-content: space-between;
}
.image-preview {
  width: 150px;
  height: 84px;
  border: 1px dashed #e6ebed;
  background: no-repeat 50% / contain;
}
.image-preview.extraHeight {
  height: 110px;
}
.image-process {
  padding: 5px 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.image-button {
  display: flex;
  align-items: center;
}
.btn-clazz {
  height: 42px;
}
.image-cropper img {
  display: block;
  /* This rule is very important, please don't ignore this */
  max-width: 100%;
}
</style>
