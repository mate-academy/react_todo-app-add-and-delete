import React, { useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoStatus } from '../../types/TodoStatus';
import { ErrorStatus } from '../../types/ErrorStatus';
import { createTodo, deleteTodo, getTodos } from '../../api/todos';

interface ContextType {
  todos: Todo[];
  setTodos: (t: Todo[]) => void;
  status: TodoStatus;
  setStatus: React.Dispatch<React.SetStateAction<TodoStatus>>;
  errorMessage: ErrorStatus;
  setErrorMessage: React.Dispatch<React.SetStateAction<ErrorStatus>>;
  addTodo: (newTodo: Todo) => void;
  tempTodo: Todo | null;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
  isSubmit: boolean;
  setIsSubmit: React.Dispatch<React.SetStateAction<boolean>>;
  loadingIds: number[];
  setLoadingIds: React.Dispatch<React.SetStateAction<number[]>>;
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  deleteChackedTodo: (id: number) => void;
}

export const TodosContext = React.createContext<ContextType>({
  todos: [],
  setTodos: () => [],
  status: TodoStatus.All,
  setStatus: () => {},
  errorMessage: ErrorStatus.NoError,
  setErrorMessage: () => {},
  addTodo: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  isSubmit: false,
  setIsSubmit: () => {},
  loadingIds: [],
  setLoadingIds: () => {},
  title: '',
  setTitle: () => {},
  deleteChackedTodo: () => {},
});

type Props = {
  children: React.ReactNode;
};

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.All);
  const [errorMessage, setErrorMessage] = useState(ErrorStatus.NoError);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const [loadingIds, setLoadingIds] = useState<number[]>([]);
  const [title, setTitle] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorStatus.ErrorLoadTodos);
        setTimeout(() => setErrorMessage(ErrorStatus.NoError), 3000);
      });
  }, []);

  const addTodo = (newTodo: Omit<Todo, 'id'>) => {
    setIsSubmit(true);
    createTodo(newTodo)
      .then(response => {
        setTodos([...todos, response]);
        setLoadingIds([...loadingIds, 0]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorStatus.ErrorAddTodo);
        setTimeout(() => setErrorMessage(ErrorStatus.NoError), 3000);
      })
      .finally(() => {
        setTempTodo(null);
        setLoadingIds(prev => prev.filter(todoId => todoId !== 0));
        setIsSubmit(false);
      });
  };

  const deleteChackedTodo = (todoId: number) => {
    setIsSubmit(true);

    setLoadingIds(prev => [...prev, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorStatus.ErrorDeleteTodo);
        setTimeout(() => setErrorMessage(ErrorStatus.NoError), 3000);
      })
      .finally(() => {
        setLoadingIds(prev => prev.filter(id => id !== todoId));
        setIsSubmit(false);
      });
  };

  const value = {
    todos,
    setTodos,
    status,
    setStatus,
    errorMessage,
    setErrorMessage,
    addTodo,
    tempTodo,
    setTempTodo,
    isSubmit,
    setIsSubmit,
    loadingIds,
    setLoadingIds,
    title,
    setTitle,
    deleteChackedTodo,
  };

  return (
    <TodosContext.Provider value={value}>{children}</TodosContext.Provider>
  );
};
