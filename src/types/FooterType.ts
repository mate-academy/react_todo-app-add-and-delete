import { FilterBtn } from './Filter';
import type { Todo } from './Todo';
import type { FooterLinks } from './footerLinks';

export type FooterType = {
  todosItemsList: Todo[];
  filtered: FilterBtn;
  footerDataArray?: FooterLinks;
  onFiltred: (value: FilterBtn) => void;
  onDeleteAll: () => void;
};
