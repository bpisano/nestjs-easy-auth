import { ToDatabaseModelConvertible } from "model-conversion";

export type DatabaseModelOf<T> = T extends ToDatabaseModelConvertible<infer U>
  ? U
  : never;
