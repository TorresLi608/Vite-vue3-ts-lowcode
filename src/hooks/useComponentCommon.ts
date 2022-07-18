import { computed } from 'vue'
import { pick } from 'lodash-es'
import { TextComponentProps } from '../defaultProps'
const useComponentCommon =(props: Readonly<Partial<TextComponentProps>>, picks: string[]) => {
  // lodash pick 从 object 对象内选择你想要的值
  /*
    var object = { 'a': 1, 'b': '2', 'c': 3 };
    _.pick(object, ['a', 'c']);
    // => { 'a': 1, 'c': 3 }
   */
  const styleProps = computed(() => pick(props, picks))
  const handleClick = () => {
    if (props.actionType === 'url' && props.url) {
      window.location.href = props.url
    }
  }
  return {
    styleProps,
    handleClick
  }
}

export default useComponentCommon