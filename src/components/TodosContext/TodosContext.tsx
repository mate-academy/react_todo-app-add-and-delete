import React, { useState } from 'react';
import { Status } from '../../types/Status';
import { Todo } from '../../types/Todo';
import { TodosContextType } from '../../types/TodosContextType';
import * as clientService from '../../api/todos';
import { ErrorMessage } from '../../types/ErrorMessage';

const USER_ID = 119;

type Props = {
  children: React.ReactNode;
};

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  tempTodo: null,
  setTodos: () => { },
  addTodo: async () => { },
  deleteTodo: () => { },
  clearCompletedTodos: () => { },
  filterStatus: Status.All,
  setFilterStatus: () => { },
  errorMessage: '',
  setErrorMessage: () => { },
  isSubmitting: false,
  setIsSubmitting: () => { },
  deletedIds: [],
  setDeletedIds: () => { },
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState(Status.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const addTodo = (newTitle: string) => {
    setIsSubmitting(true);
    setErrorMessage('');

    const createdTodo: Omit<Todo, 'id'> = {
      userId: USER_ID,
      title: newTitle,
      completed: false,
    };

    setTempTodo({
      ...createdTodo,
      id: 0,
    });

    return clientService.createTodo(createdTodo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.adding);
        throw error;
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  const deleteTodo = (id: number) => {
    setIsSubmitting(true);
    setDeletedIds((ids) => [...ids, id]);

    return clientService.deleteTodo(id)
      .then(() => setTodos(prev => prev
        .filter(currentTodo => currentTodo.id !== id)))
      .catch((error) => {
        setErrorMessage(ErrorMessage.deleting);
        throw error;
      })
      .finally(() => setDeletedIds((ids) => ids
        .filter(todoId => todoId !== id)));
  };

  const clearCompletedTodos = () => {
    todos.filter(todo => todo.completed).forEach((todo) => {
      deleteTodo(todo.id);
    });
  };

  return (
    <TodosContext.Provider
      value={{
        todos,
        tempTodo,
        setTodos,
        addTodo,
        deleteTodo,
        clearCompletedTodos,
        filterStatus,
        setFilterStatus,
        errorMessage,
        setErrorMessage,
        isSubmitting,
        setIsSubmitting,
        deletedIds,
        setDeletedIds,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
