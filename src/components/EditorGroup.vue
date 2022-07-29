<template>
  <div class="edit-groups">
    {{newGroups}}
  </div>
</template>
<script lang="ts">
import { defineComponent, PropType ,computed} from 'vue'
import { AllComponentProps } from '@/uitils/defaultProps'
export interface GroupProps {
  text: string
  items: string[]
}
const defaultEditGroups: GroupProps[] = [
  {
    text: '尺寸',
    items: [
      'height',
      'width',
      'paddingLeft',
      'paddingRight',
      'paddingTop',
      'paddingBottom',
    ],
  },
  {
    text: '边框',
    items: ['borderStyle', 'borderColor', 'borderWidth', 'borderRadius'],
  },
  {
    text: '阴影与透明度',
    items: ['opacity', 'boxShadow'],
  },
  {
    text: '位置',
    items: ['left', 'top'],
  },
  {
    text: '事件功能',
    items: ['actionType', 'url'],
  },
]
export default defineComponent({
  name: 'EditorGroup',
  props: {
    props: {
      type: Object as PropType<AllComponentProps>,
      required: true,
    },
    groups: {
      type: Array as PropType<GroupProps[]>,
      default: [...defaultEditGroups],
    },
  },
  setup(props) {
    const newGroups = computed(()=>{
      const allNormalProps = props.groups.reduce((prev,current)=>{
        return [...prev,...current.items]
      },[] as string[])
      console.log(allNormalProps,'allNormalProps')
    })
    return {
      newGroups
    }
  },
})
</script>
