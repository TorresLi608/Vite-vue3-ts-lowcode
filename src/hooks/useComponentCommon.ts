import { inject,computed } from 'vue'
import { pick } from 'lodash-es'
import { TextComponentProps } from '../uitils/defaultProps'
// Partial ts 里使用了这个表示里面的范型都变成可选项，可有可无
const useComponentCommon =(props: Readonly<Partial<TextComponentProps>>, picks: string[]) => {
  // lodash pick 从 object 对象内筛选你想要的值
  /*
    var object = { 'a': 1, 'b': '2', 'c': 3 };
    _.pick(object, ['a', 'c']);
    // => { 'a': 1, 'c': 3 }
   */
  // 使用依赖注入的方法来确认是在编辑器里面，如果在里面则点击不进行跳转，因为编辑器里只负责配置
  const isEditor = inject('isEditor')
  const styleProps = computed(() => pick(props, picks))
  const handleClick = () => {
    if (props.actionType === 'to' && props.url && !isEditor) {
      window.location.href = props.url
    }
  }
  return {
    styleProps,
    handleClick
  }
}

export default useComponentCommon