import { CustomError } from '../types/CustomError';
import { Filter } from '../types/Filter';
import { USER_ID } from '../utils/fetchClient';

export const initData = {
  todos: [],
  filter: Filter.All,
  customError: CustomError.NoError,
  activeLeft: 0,
  editField: '',
  tempTodo: null,
  newTodo: {
    title: '',
    userId: USER_ID,
    completed: false,
  },
};
