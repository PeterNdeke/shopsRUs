export interface ICore<T = string> {
  id: T;
  createdAt: Date | string;
  updatedAt?: Date | string;
}
