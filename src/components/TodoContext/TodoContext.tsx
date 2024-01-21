import React, { useEffect, useState } from 'react';
import * as client from '../../api/todos';
import { Todo } from '../../types/Todo';
import { Status } from '../../types/Status';
import { ErrorTypes } from '../../types/ErrorTypes';

type Props = {
  children: React.ReactNode;
};

const USER_ID = 12173;

type ContextType = {
  todos: Todo[];
  setTodos: (todoArr: Todo[]) => void;
  filterStatus: Status;
  setFilterStatus: React.Dispatch<React.SetStateAction<Status>>;
  setHasError: React.Dispatch<React.SetStateAction<ErrorTypes>>
  hasError: ErrorTypes;
  deleteTodo: (id: number) => void;
  isDisabled: boolean,
  setIsDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  deleteCompleted: (ids: number[]) => void;
  addTodo: (title: string) => void;
  tempTodoIds: number[];
  setTempTodoIds: React.Dispatch<React.SetStateAction<number[]>>;
  tempTodo: Todo | null;
  todoTitle: string;
  setTodoTitle: React.Dispatch<React.SetStateAction<string>>;
};

export const TodosContext = React.createContext<ContextType>({
  todos: [],
  setTodos: () => {},
  filterStatus: Status.All,
  setFilterStatus: () => {},
  hasError: ErrorTypes.Empty,
  setHasError: () => {},
  deleteTodo: () => {},
  isDisabled: false,
  setIsDisabled: () => {},
  deleteCompleted: () => {},
  addTodo: () => {},
  tempTodoIds: [],
  setTempTodoIds: () => {},
  tempTodo: null,
  todoTitle: '',
  setTodoTitle: () => {},
});

export const TodosProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterStatus, setFilterStatus] = useState(Status.All);
  const [hasError, setHasError] = useState(ErrorTypes.Initial);
  const [isDisabled, setIsDisabled] = useState(false);
  const [tempTodoIds, setTempTodoIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');

  useEffect(() => {
    client.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setHasError(ErrorTypes.Loading));
  }, []);

  const deleteCompleted = (ids: number[]) => {
    setIsDisabled(true);
    setTempTodoIds(prev => [...prev, ...ids]);

    Promise.all(ids.map(el => client.deleteTodos(el)))
      .then(() => {
        setTodos(prev => prev.filter((todo) => !todo.completed));
      })
      .catch(() => setHasError(ErrorTypes.Delete))
      .finally(() => {
        setIsDisabled(false);
        setTempTodoIds(prev => prev.filter(el => !ids.includes(el)));
      });
  };

  const deleteTodo = (id: number) => {
    setIsDisabled(true);
    setTempTodoIds(prev => [id, ...prev]);

    client.deleteTodos(id)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== id));
      })
      .catch(() => setHasError(ErrorTypes.Delete))
      .finally(() => {
        setIsDisabled(false);
        setTempTodoIds(prev => prev.filter(n => n !== id));
      });
  };

  const addTodo = (title: string) => {
    const tTodo: Todo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(tTodo);

    setTempTodoIds(prev => [0, ...prev]);
    setIsDisabled(true);

    client.createTodo(tTodo)
      .then((todo: Todo) => {
        setTodoTitle('');
        setTodos(prev => [todo, ...prev]);
      })
      .catch(() => {
        setHasError(ErrorTypes.Add);
      })
      .finally(() => {
        setIsDisabled(false);
        setTempTodo(null);
        setTempTodoIds(prev => prev.filter(el => el));
      });
  };

  return (
    <TodosContext.Provider value={{
      todos,
      setTodos,
      filterStatus,
      setFilterStatus,
      setHasError,
      hasError,
      deleteTodo,
      isDisabled,
      setIsDisabled,
      deleteCompleted,
      addTodo,
      tempTodoIds,
      setTempTodoIds,
      tempTodo,
      todoTitle,
      setTodoTitle,
    }}
    >
      {children}
    </TodosContext.Provider>
  );
};
