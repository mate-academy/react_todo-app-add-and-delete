/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import classNames from 'classnames';

import { Todo } from './types/Todo';
import { Filter } from './types/Filter';

import * as api from './api/todos';

import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);

  const [filter, setFilter] = useState<Filter>('All');

  const [processing, setProcessing] = useState<number[]>([]);

  const formField = useRef<HTMLInputElement>(null);

  // #region errors
  const timeoutId = useRef(0);

  const hideError = useCallback(() => {
    clearTimeout(timeoutId.current);
    timeoutId.current = window.setTimeout(setShowErrorMessage, 3000, false);
  }, []);

  const showError = useCallback((message: string) => {
    hideError();
    setShowErrorMessage(true);
    setErrorMessage(message);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endregion

  // #region useEffect
  useEffect(() => {
    api
      .getTodos()
      .then(setTodos)
      .catch(() => showError('Unable to load todos'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isLoading) {
      formField.current?.focus();
    }
  }, [isLoading]);
  // #endregion

  // #region adding
  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setShowErrorMessage(false);
      setTitle(event.target.value);
    },
    [],
  );

  const trimmedTitle = title.trim();

  const addTodo = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();

      if (!trimmedTitle) {
        showError('Title should not be empty');

        return;
      }

      const newTodo: Todo = {
        id: 0,
        userId: api.USER_ID,
        title: trimmedTitle,
        completed: false,
      };

      setIsLoading(true);
      setTempTodo(newTodo);

      api
        .createTodo(newTodo)
        .then(loadedTodo => {
          setTodos(prevTodos => {
            return [...prevTodos, loadedTodo];
          });

          setTitle('');
        })
        .catch(() => showError('Unable to add a todo'))
        .finally(() => {
          setTempTodo(null);
          setIsLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [trimmedTitle],
  );
  // #endregion

  // #region filtering
  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'All':
        return todos;

      case 'Active':
        return todos.filter(todo => !todo.completed);

      case 'Completed':
        return todos.filter(todo => todo.completed);
    }
  }, [todos, filter]);
  // #endregion

  // #region deletion
  const deleteTodo = useCallback(async (todoId: number) => {
    try {
      await api.deleteTodo(todoId);

      formField.current?.focus();
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch (e) {
      showError('Unable to delete a todo');

      throw e;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const processDeletion = useCallback((completedTodoIds: number[]) => {
    Promise.allSettled(
      completedTodoIds.map(todoId => api.deleteTodo(todoId).then(() => todoId)),
    ).then(results => {
      setTodos(prevTodos => {
        let isErrorVisible = false;

        for (const result of results) {
          if (result.status === 'rejected') {
            if (!isErrorVisible) {
              isErrorVisible = true;
              showError('Unable to delete a todo');
            }

            continue;
          }

          const todoId = result.value;
          const index = prevTodos.findIndex(todo => todo.id === todoId);

          prevTodos.splice(index, 1);
        }

        setProcessing([]);
        formField.current?.focus();

        return [...prevTodos];
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const deleteCompleted = useCallback(() => {
    setTodos(prevTodos => {
      const completedTodoIds = prevTodos
        .filter(todo => todo.completed)
        .map(todo => todo.id);

      setProcessing(completedTodoIds);
      processDeletion(completedTodoIds);

      return prevTodos;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // #endregion

  const activeCount = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: !activeCount,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={addTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={formField}
              value={title}
              onChange={handleTitleChange}
              disabled={isLoading}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          processing={processing}
          onDelete={deleteTodo}
        />

        {todos.length !== 0 && (
          <Footer
            totalCount={todos.length}
            activeCount={activeCount}
            clearCompleted={deleteCompleted}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !showErrorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setShowErrorMessage(false)}
        />

        {errorMessage}
      </div>
    </div>
  );
};
