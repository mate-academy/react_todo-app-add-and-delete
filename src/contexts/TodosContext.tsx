import React, { useEffect, useMemo, useState } from 'react';
import { Todo, TodoID } from '../types/Todo';
import { TodosFilterQuery } from '../constants';
import getPreparedTodos from '../utils/getPreparedTodos';
import { addNewTodo, getTodos } from '../api/todos';

interface TodosContextType {
  todos: Todo[];
  preparedTodos: Todo[];
  query: TodosFilterQuery,
  error: string,
  tempTodo: null | Todo,
  addTodo: ((newTodo: Todo) => Promise<void>) | null;
  editTodo: (todoToEdit: Todo) => void;
  deleteTodo: (todoID: TodoID) => void;
  setQuery: React.Dispatch<React.SetStateAction<TodosFilterQuery>>,
  setError: React.Dispatch<React.SetStateAction<string>>,
}

export const TodosContext = React.createContext<TodosContextType>({
  todos: [],
  preparedTodos: [],
  query: TodosFilterQuery.all,
  error: '',
  tempTodo: null,
  addTodo: null,
  editTodo: () => { },
  deleteTodo: () => { },
  setQuery: () => { },
  setError: () => { },
});

export const TodosProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [query, setQuery] = useState(TodosFilterQuery.all);
  const [error, setError] = useState('');

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setError('Something went wrong. Failed to load todos');
      });
  }, []);

  const preparedTodos = useMemo(
    () => getPreparedTodos(todos, query),
    [todos, query],
  );

  const addTodo = (newTodo: Todo) => {
    setTempTodo(newTodo);

    return addNewTodo(newTodo)
      .then((newTodoFromServer) => {
        setTodos(prevTodos => [...prevTodos, newTodoFromServer]);
      })
      .finally(() => setTempTodo(null));
  };

  const editTodo = (todoToEdit: Todo) => {
    setTodos(prevTodos => prevTodos.map(todo => {
      if (todo.id === todoToEdit.id) {
        return todoToEdit;
      }

      return todo;
    }));
  };

  const deleteTodo = (todoID: TodoID) => {
    setTodos(prevTodos => (
      prevTodos.filter(todo => todo.id !== todoID)
    ));
  };

  const value: TodosContextType = {
    todos,
    preparedTodos,
    query,
    error,
    tempTodo,
    addTodo,
    editTodo,
    deleteTodo,
    setQuery,
    setError,
  };

  return (
    <TodosContext.Provider value={value}>
      {children}
    </TodosContext.Provider>
  );
};
