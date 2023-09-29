import { ToDatabaseModelConvertible, ToPublicModelConvertible } from 'model-conversion';
import { Identifiable } from '../../../utils/interfaces/identifiable';

export type UserRepresentation<DatabaseModel, PublicModel> = Identifiable &
  ToDatabaseModelConvertible<DatabaseModel> &
  ToPublicModelConvertible<PublicModel>;
