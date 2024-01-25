import {
  FC,
  ReactNode,
  useState,
  useEffect,
  useMemo,
} from 'react';

import { getTodos, deleteTodo, addTodo } from '../../api/todos';
import { Context } from '../../Context';

import { Todo } from '../../types/Todo';
import { ErrorMessage } from '../../types/ErrorMessage';
import { Filter } from '../../types/Filter';

interface Props {
  children: ReactNode;
}

export const USER_ID = 12176;

export const ContextProvider: FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const handleErrorChange = (value: string) => {
    setErrorMessage(value);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => handleErrorChange(ErrorMessage.UNABLE_TO_LOAD));
  }, [todos]);

  const handleStatusEdit = () => {
    handleErrorChange(ErrorMessage.UNABLE_TO_UPDATE);
  };

  const filteredTodos = useMemo(() => {
    if (filter === Filter.ACTIVE) {
      return todos.filter((item) => !item.completed);
    }

    if (filter === Filter.COMPLETED) {
      return todos.filter((item) => item.completed);
    }

    return todos;
  }, [filter, todos]);

  const handleActiveTodos = useMemo(() => {
    return todos.reduce((sum, item) => {
      if (!item.completed) {
        return sum + 1;
      }

      return sum;
    }, 0);
  }, [todos]);

  const handleRemoveTodo = (todoId: number) => {
    deleteTodo(todoId)
      .catch(() => handleErrorChange(ErrorMessage.UNABLE_TO_DELETE));
  };

  const handleAddTodo = (todoTitle: string) => {
    const newTodo: Omit<Todo, 'id'> = {
      title: todoTitle,
      userId: USER_ID,
      completed: false,
    };

    addTodo(newTodo)
      .catch(() => handleErrorChange(ErrorMessage.UNABLE_TO_ADD));
  };

  return (
    <Context.Provider value={{
      todos,
      filteredTodos,
      errorMessage,
      handleErrorChange,
      handleStatusEdit,
      handleActiveTodos,
      handleAddTodo,
      handleRemoveTodo,
      filter,
      setFilter,
    }}
    >
      {children}
    </Context.Provider>
  );
};
