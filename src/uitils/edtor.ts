import { v4 as uuidv4 } from 'uuid'
import {
  EditorProps,
  HistoryProps,
  UpdateComponentData,
} from '@/types'
import { AllComponentProps } from '@/uitils/defaultProps'
import { debounceChange } from '@/uitils/helper'
export const pushHistory = (state: EditorProps, historyRecord: HistoryProps) => {
  if (state.historyIndex !== -1) {
    state.histories = state.histories.slice(0, state.historyIndex)
    state.historyIndex = -1
  }
  if (state.histories.length < state.maxHistoryNumber) {
    state.histories.push(historyRecord)
  } else {
    state.histories.shift()
    state.histories.push(historyRecord)
  }
}
export const pushModifyHistory = (
  state: EditorProps,
  { key, value, id }: UpdateComponentData
) => {
  pushHistory(state, {
    id: uuidv4(),
    componentId: id || state.currentElement,
    type: 'modify',
    data: { oldValue: state.cachedOldValues, newValue: value, key },
  })
  state.cachedOldValues = null
}
export const modifyHistory = (
  state: EditorProps,
  history: HistoryProps,
  type: 'undo' | 'redo'
) => {
  const { componentId, data } = history
  const { key, oldValue, newValue } = data
  const newKey = key as keyof AllComponentProps | Array<keyof AllComponentProps>
  const updatedComponent = state.components.find(
    (component) => component.id === componentId
  )
  if (updatedComponent) {
    // check if key is array
    if (Array.isArray(newKey)) {
      newKey.forEach((keyName, index) => {
        updatedComponent.props[keyName] =
          type === 'undo' ? oldValue[index] : newValue[index]
      })
    } else {
      updatedComponent.props[newKey] = type === 'undo' ? oldValue : newValue
    }
  }
}
export const pushHistoryDebounce = debounceChange(pushModifyHistory)
