/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { TodosContext } from './components/TodosContext';
import { TodosFilter } from './types/TodosFilter';
import { TodosHeader } from './components/TodosHeader';
import { TodosList } from './components/TodosList';
import { getTodos } from './api/todos';
import { TodosError } from './components/TodosError';
import { TodosFooter } from './components/TodosFooter';

const USER_ID = 11891;

const DEFAULT_DATA = {
  userId: USER_ID,
  title: '',
  completed: false,
};

const useFilter = (todos: Todo[], filter: string) => {
  return todos.filter(todo => {
    switch (filter) {
      case TodosFilter.active:
        return !todo.completed;
      case TodosFilter.completed:
        return todo.completed;
      default:
        return true;
    }
  });
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosFilter, setTodosFilter] = useState<TodosFilter>(TodosFilter.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [todoEditId, setTodoEditId] = useState(0);
  const [todoEditTitle, setTodoEditTitle] = useState('');
  const [todoIdLoading, setTodoIdLoading] = useState<number | null>(null);
  const [todoEditLoading, setTodoEditLoading] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todo => setTodos(todo))
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  }, [errorMessage]);

  const todosAfterFiltering = useFilter([...todos], todosFilter);

  return (
    <TodosContext.Provider
      value={{
        DEFAULT_DATA,
        todosAfterFiltering,
        todos,
        todosFilter,
        errorMessage,
        todoEditTitle,
        todoEditId,
        inputRef,
        todoIdLoading,
        todoEditLoading,
        setTodoEditLoading,
        setTodoIdLoading,
        setTodos,
        setTodosFilter,
        setErrorMessage,
        setTodoEditTitle,
        setTodoEditId,
      }}
    >

      <div className="todoapp">
        <h1 className="todoapp__title">todos</h1>

        <div className="todoapp__content">
          <TodosHeader />

          <TodosList />

          {todos.length > 0 && (
            <TodosFooter />
          )}
        </div>

        <TodosError />
      </div>
    </TodosContext.Provider>
  );
};
