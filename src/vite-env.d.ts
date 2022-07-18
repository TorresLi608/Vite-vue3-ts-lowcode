/// <reference types="vite/client" />

// 自定义env变量时可以增加代码提示
interface ImportMetaEnv {
  readonly VITE_TITLE: string;
}

// interface ImportMeta {
//   readonly env: ImportMetaEnv;
// }
