<template>
  <div class="props-table">
    <div v-for="(value, key) in finalProps" :key="key" class="prop-item">
      <span class="label" v-if="value.text">{{ value.text }}</span>
      <div class="prop-component">
        <component
          v-if="value"
          :is="value.component"
          :value.valueProp="value.value"
          v-bind="value.extraProps"
          v-on="value.events"
        >
          <template v-if="value.options">
            <component
              v-for="(option, k) in value.options"
              :is="value.subComponent"
              :key="k"
              :value="option.value"
            >
            <RenderVnodes :vNode="option.text"></RenderVnodes>
            </component>
          </template>
        </component>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { reduce } from 'lodash-es'
import { defineComponent, PropType, computed, VNode } from 'vue'
import { TextComponentProps } from '@/uitils/defaultProps'
import { mapPropsToForms } from '@/uitils/propsMap'
import RenderVnodes from '@/components/RenderVnodes'
import ColorPicker from '@/components/ColorPicker.vue'
import ImageProcesser from '@/components/ImageProcesser.vue'
import ShadowPicker from '@/components/ShadowPicker.vue'

interface FormProps {
  component: string
  subComponent?: string
  value: string
  extraProps?: { [key: string]: any }
  text?: string
  options?: { text: string | VNode; value: any }[]
  valueProp: string
  eventName: string
  events: { [key: string]: (e: any) => void }
}
export default defineComponent({
  name: 'PropsTable',
  components:{
    RenderVnodes,
    ColorPicker,
    ImageProcesser,
    ShadowPicker
  },
  props: {
    props: {
      type: Object as PropType<Partial<TextComponentProps>>,
    },
  },
  emits: ['change'],
  setup(props, context) {
    // keyof 相当于一个interface 的某一个元素用或者的方式找其中一个元素keyof是索引类型查询操作符。
    /**
         举例
         interfacc Type {
          webName:string;
          cage:number;
          address:string
         }
         type ant= keyof Itest;
         ant = webName | cage | address 其中一个
         */
    const finalProps = computed(() => {
      return reduce(
        props.props,
        (result, value, key) => {
          const newKey = key as keyof TextComponentProps
          const item = mapPropsToForms[newKey]
          if (item) {
            const {
              valueProp = 'value',
              eventName = 'change',
              initalTransform,
              afterTransform,
            } = item
            const newItem: FormProps = {
              ...item,
              value: initalTransform ? initalTransform(value) : value,
              valueProp,
              eventName,
              events: {
                [eventName]: (e: any) => {
                  context.emit('change', {
                    key,
                    value: afterTransform ? afterTransform(e) : e,
                  })
                },
              },
            }
            result[newKey] = newItem
          }
          return result
        },
        {} as { [key: string]: FormProps }
      )
    })
    return {
      finalProps,
    }
  },
})
</script>

<style scoped>
.prop-item {
  display: flex;
  margin-bottom: 10px;
  align-items: center;
}

.label {
  width: 18%;
}

.prop-component {
  width: 70%;
}

.prop-item.no-text {
  display: inline-block;
  margin: 0 10px 0 0;
}

#item-fontWeight {
  margin-left: 28%;
}

.component-a-select .ant-select {
  width: 150px;
}

.prop-component.component-shadow-picker,
.prop-component.component-image-processer,
.prop-component.component-background-processer {
  width: 100%;
}
</style>
