import {
  PropsWithChildren,
  createContext, useContext, useEffect, useState,
} from 'react';
import { TodoType } from '../../types/Todo';
import { TodosContextType } from './types';
import { Filters } from '../../types/Filters';
import { delTodo, getTodos } from '../../api/todos';
import { ErrorsContext } from '../ErrorsProvider/ErrorsProvider';
import { NewTodoContext } from '../NewTodoProvider/NewTodoProvider';

export const TodosContext
= createContext<TodosContextType | undefined>(undefined);

export const TodosProvider = ({ children }: PropsWithChildren) => {
  const [filter, setFilter] = useState<Filters>('all');
  const [todos, setTodos] = useState<TodoType[]>([]);
  const [loadingTodos, setLoadingTodos] = useState<boolean>(true);
  const errorsContext = useContext(ErrorsContext);
  const newTodoContext = useContext(NewTodoContext);

  if (!errorsContext) {
    throw new Error('TodosProvider must be used within an ErrorsProvider');
  }

  if (!newTodoContext) {
    throw new Error('TodosProvider must be used within an NewTodoContext');
  }

  const { handleSubmit } = newTodoContext;
  const { addError } = errorsContext;

  const handleTodoDel = (todo: TodoType) => {
    delTodo(todo);
  };

  useEffect(() => {
    getTodos(11524)
      .then(setTodos)
      .catch(() => addError('errorLoadingTodos'))
      .finally(() => setLoadingTodos(false));
  }, [handleSubmit, addError, handleTodoDel]);

  const handleFilter = (fil: Filters) => {
    setFilter(fil);
  };

  const visibleTodos = (fil: Filters) => {
    if (fil === 'active') {
      return todos.filter(todo => !todo.completed);
    }

    if (fil === 'completed') {
      return todos.filter(todo => todo.completed);
    }

    return todos;
  };

  const filteredTodos = visibleTodos(filter);

  return (
    <TodosContext.Provider value={{
      todos,
      loadingTodos,
      handleFilter,
      filteredTodos,
      filter,
      handleTodoDel,
      // handleChecked,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
