import { Todo } from './Todo';

export type Filter = {
  hash: string;
  name: string;
  fn: (todo: Todo) => boolean;
};
