<template>
  <div class="props-table">
    <div 
    v-for="(value,key) in finalProps"
    :key="key"
    class="prop-item"
    >
    <span class="label" v-if="value.text">{{value.text}}</span>
   <div class="prop-component">
     <component v-if="value" :is="value.component" :value=value.value v-bind="value.extraProps"></component>
   </div>
    </div>
  </div>
</template>
<script lang="ts">
import { reduce } from 'lodash'
import { defineComponent, PropType, computed } from 'vue'
import { TextComponentProps } from '@/defaultProps'
import { PropsToForms, mapPropsToForms } from '@/propsMap'
export default defineComponent({
  name: 'PropsTable',
  props: {
    props: {
      type: Object as PropType<Partial<TextComponentProps>>,
    },
  },
  setup(props) {
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
            item.value = value
            result[newKey] = item
          }
          return result
        },
        {} as Required<PropsToForms>
      )
    })
    return {
      finalProps
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
  width: 28%;
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
