import { useState } from 'react';
import { FilterType } from '../../types/Filter';
import { Todo } from '../../types/Todo';

export const useTodoState = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FilterType.All);

  return {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    filter,
    setFilter,
  };
};
