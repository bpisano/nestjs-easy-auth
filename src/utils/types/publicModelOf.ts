import { ToPublicModelConvertible } from "model-conversion";

export type PublicModelOf<T> = T extends ToPublicModelConvertible<infer U>
  ? U
  : never;
