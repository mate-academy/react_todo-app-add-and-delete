import { FilterTypes } from './FilterTypes';
import { Todo } from './Todo';

export type Filter = {
  type: FilterTypes;
  name: string;
  cb: (todo: Todo) => boolean;
  hash: string;
};
