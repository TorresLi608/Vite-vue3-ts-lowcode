<template>
  <div class="edit-groups">
    <a-collapse v-model:activeKey="currentKey">
      <a-collapse-panel
        v-for="(item, index) in editorGroups"
        :key="`item-${index}`"
        :header="item.text"
      >
        <props-table :props="item.props" @change="handleChange"></props-table>
      </a-collapse-panel>
    </a-collapse>
  </div>
</template>
<script lang="ts">
import { difference } from 'lodash-es'
import { defineComponent, PropType, computed, ref } from 'vue'
import { AllComponentProps } from '@/uitils/defaultProps'
import PropsTable from '@/components/PropsTable.vue'

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
  components: { PropsTable },
  emits: ['change'],
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
  setup(props, { emit }) {
    const currentKey = ref<string>('item-0')
    const newGroups = computed(() => {
      const allNormalProps = props.groups.reduce((prev, current) => {
        return [...prev, ...current.items]
      }, [] as string[])
      // difference([3, 2, 1], [4, 2]);
      // 结果为： [3, 1]
      const specialProps = difference(Object.keys(props.props), allNormalProps)
      return [
        {
          text: '基础信息',
          items: specialProps,
        },
        ...props.groups,
      ]
    })

    const editorGroups = computed(() => {
      const editorGroups = newGroups.value.map((group) => {
        const propsMap = {} as AllComponentProps
        group.items.forEach((item) => {
          const key = item as keyof AllComponentProps
          propsMap[key] = props.props[key]
        })
        return {
          ...group,
          props: propsMap,
        }
      })
      return editorGroups
    })

    const handleChange = (e: any) => {
      emit('change', e)
    }

    return {
      editorGroups,
      currentKey,
      handleChange
    }
  },
})
</script>
