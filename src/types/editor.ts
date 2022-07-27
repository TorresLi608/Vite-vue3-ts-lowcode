export interface ComponentData {
  props:{[key:string]:any},
  id:string,
  name:string
}
export interface EditorProps {
  components:ComponentData[],
  currentElement:string
}