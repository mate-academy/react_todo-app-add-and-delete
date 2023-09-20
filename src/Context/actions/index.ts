import { TodosListType } from '../../types/todosTypes';
import { Actions } from '../../types/actionTypes';

export const loadTodosAction = (data: TodosListType): Actions => ({
  type: 'LOAD',
  payload: data,
});
