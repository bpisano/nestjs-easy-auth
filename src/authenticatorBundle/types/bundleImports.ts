import { DynamicModule, ForwardReference, Type } from '@nestjs/common';

export type BundleImports = (DynamicModule | Type<any> | Promise<DynamicModule> | ForwardReference<any>)[];
