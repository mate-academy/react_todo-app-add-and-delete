/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { client } from './utils/fetchClient';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { Filter } from './types/Filter';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { ErrorMessage } from './components/EroorMessage/ErrorMessage';
import { TodoInput } from './components/TodoInput/TodoInput';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filter>(Filter.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [todosToDelete, setTodosToDelete] = useState<number[]>([]);

  const getFilteredTodos = () => {
    switch (filter) {
      case Filter.Active:
        return todos.filter(todo => !todo.completed);
      case Filter.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const todosToRender = getFilteredTodos();

  useEffect(() => {
    client
      .get<Todo[]>(`/todos?userId=${USER_ID}`)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      timeoutRef.current = setTimeout(() => {
        setErrorMessage('');
      }, 3000);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoInput
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          inputRef={inputRef}
        />

        {!!todos.length && (
          <>
            <TodoList
              todos={todosToRender}
              tempTodo={tempTodo}
              setTodos={setTodos}
              setErrorMessage={setErrorMessage}
              inputRef={inputRef}
              todosToDelete={todosToDelete}
              setTodosToDelete={setTodosToDelete}
            />

            {/* Hide the footer if there are no todos */}
            <TodoFooter
              todos={todos}
              setFilter={setFilter}
              filter={filter}
              setTodosToDelete={setTodosToDelete}
            />
          </>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
