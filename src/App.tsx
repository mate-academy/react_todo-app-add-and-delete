/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { Todo } from './types/Todo';
import { TodosContext } from './components/TodosContext';
import { TodosFilter } from './types/TodosFilter';
import { TodosHeader } from './components/TodosHeader';
import { TodosList } from './components/TodosList';
import { TodoFilter } from './components/TodoFilter';
import { deleteTodos, getTodos } from './api/todos';

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
  const [todoIsLoading, setTodoIsLoading] = useState<number | null>(null);
  const [todoEditIsLoading, setTodoEditIsLoading] = useState<Todo | null>(null);
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

  const todosLeft = todos.filter(todo => !todo.completed).length;

  const clearComplete = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        deleteTodos(todo.id)
          .catch(() => {
            setErrorMessage('Unable to load todos');
          });
      }
    });
    setTodos(todos.filter(todo => !todo.completed));
  };

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
        todoIsLoading,
        todoEditIsLoading,
        setTodoEditIsLoading,
        setTodoIsLoading,
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

          {/* Hide the footer if there are no todos */}
          {todos.length > 0 && (
            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${todosLeft} items left`}
              </span>

              <TodoFilter />

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={clearComplete}
              >
                Clear completed
              </button>
            </footer>
          )}
        </div>

        <div
          data-cy="ErrorNotification"
          className={cn(
            'notification is-danger is-light has-text-weight-normal', {
              hidden: !errorMessage,
            },
          )}
        >
          {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
          <button data-cy="HideErrorButton" type="button" className="delete" />
          {errorMessage}
        </div>
      </div>
    </TodosContext.Provider>
  );
};
