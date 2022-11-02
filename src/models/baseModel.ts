import { Model } from "sequelize";

type TModelOptions<T> = Omit<T, "createdAt"> & { createdAt?: string | Date };

export class BaseModel<
  TModel extends {},
  TCreate extends {} = TModel
> extends Model<TModelOptions<TModel>, TCreate> {
  static base_getAttributeKeys(modelClass: any): string[] {
    try {
      if (!modelClass?.rawAttributes) {
        return [];
      }
      return Object.keys(modelClass.rawAttributes);
    } catch (error) {
      return [];
    }
  }
}
