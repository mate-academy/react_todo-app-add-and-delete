import React, { useEffect, useState } from 'react';

// eslint-disable-next-line import/no-cycle
import { USER_ID } from '../App';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { TodoContextProps } from '../types/TodoContextProps';
import { deleteTodoo, getTodos } from '../api/todos';

export const TodoContext = React
  .createContext<TodoContextProps>({
  todos: [],
  filter: Status.ALL,
  addTodo: () => {},
  toggleCompleted: () => {},
  toggleAllCompleted: () => {},
  deleteTodo: () => {},
  clearCompleted: () => {},
  updateTodoTitle: () => {},
  setFilter: () => {},
  errorMessage: '',
  setErrorMessage: () => {},
  handlerDeleteCompleted: () => {},
  tempTodo: null,
  setTempTodo: () => {},
  deleteTodoId: [],
  setDeletedTodoId: () => {},
});

type Props = {
  children: React.ReactNode,
};

export const TodoProvider: React.FC<Props> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Status>(Status.ALL);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [deleteTodoId, setDeletedTodoId] = useState<number[]>([]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  const addTodo = (todo: Todo) => {
    setTodos([...todos, todo]);
  };

  const deleteTodo = (idTodo: number) => {
    // setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    setDeletedTodoId((prevIds) => [...prevIds, idTodo]);

    deleteTodoo(idTodo)
      .then(() => {
        setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== idTodo));
      })
      .catch(() => setErrorMessage('Unable to delete todo'))
      .finally(() => {
        setDeletedTodoId([]);
      });
  };

  const toggleCompleted = (id: number) => {
    setTodos(prevTodos => prevTodos
      .map(todo => (todo.id === id
        ? { ...todo, completed: !todo.completed }
        : todo)));
  };

  const handlerDeleteCompleted = () => {
    setTodos(todos.filter(todo => !todo.completed));
  };

  const toggleAllCompleted = () => {
    const allCompleted = todos.every(todo => todo.completed);

    setTodos(prevTodos => prevTodos
      .map(todo => ({ ...todo, completed: !allCompleted })));
  };

  const clearCompleted = () => {
    setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
  };

  const updateTodoTitle = (id: number, newTitle: string) => {
    setTodos(prevTodos => prevTodos
      .map(todo => (todo.id === id ? { ...todo, title: newTitle } : todo)));
  };

  const valueTodo: TodoContextProps = {
    todos,
    filter,
    addTodo,
    deleteTodo,
    toggleCompleted,
    toggleAllCompleted,
    clearCompleted,
    updateTodoTitle,
    setFilter,
    errorMessage,
    setErrorMessage,
    handlerDeleteCompleted,
    tempTodo,
    setTempTodo,
    deleteTodoId,
    setDeletedTodoId,
  };

  return (
    <TodoContext.Provider value={valueTodo}>
      {children}
    </TodoContext.Provider>
  );
};
