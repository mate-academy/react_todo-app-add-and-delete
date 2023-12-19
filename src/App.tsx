/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { Status } from './types/Status';

const USER_ID = 12042;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(Status.all);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [loadingTodoIds, setLoadingTodoIds] = useState<number[]>([]);
  // const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const titleField = useRef<HTMLInputElement>(null);

  const handleError = (errorMessage: string) => {
    setError(errorMessage);
    setTimeout(() => {
      setError(null);
    }, 3000);
  };

  useEffect(() => {
    if (titleField.current) {
      titleField.current.focus();
    }

    todosService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => (handleError('Unable to load todos')));
  }, []);

  const filteredTodos = useMemo(() => {
    switch (status) {
      case Status.all: {
        return todos;
      }

      case Status.active: {
        return todos.filter(todo => !todo.completed);
      }

      case Status.completed: {
        return todos.filter(todo => todo.completed);
      }

      default: {
        return todos;
      }
    }
  }, [todos, status]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const createTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!todoTitle) {
      handleError('Title should not be empty');
    }

    if (todoTitle) {
      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      });

      todosService.addTodo({
        userId: USER_ID, title: todoTitle, completed: false,
      })
        .then(newTodo => {
          setTodos(currentTodos => {
            const maxId = Math.max(0, ...currentTodos.map(todo => todo.id));
            const id = maxId + 1;

            return [...currentTodos, { ...newTodo, id }];
          });
        })
        .then(() => setTodoTitle(''))
        .catch(() => handleError('Unable to add a todo'))
        .finally(() => setTempTodo(null));
    }
  };

  const deleteTodo = (todoId: number) => {
    setLoadingTodoIds(curr => [...curr, todoId]);

    todosService.deleteTodo(todoId)
      .then(() => setTodos(
        currentTodos => currentTodos.filter(todo => todo.id !== todoId),
      ))
      .catch(() => handleError('Unable to delete a todo'))
      .finally(() => {
        setLoadingTodoIds(curr => curr.filter(id => id !== todoId));
      });
  };

  const clearTodos = () => {
    todos.map(todo => {
      if (todo.completed === true) {
        todosService.deleteTodo(todo.id);
      }

      return 1;
    });

    setTodos(
      currentTodos => currentTodos.filter(todo => todo.completed !== true),
    );
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form
            onSubmit={createTodo}
          >
            <input
              ref={titleField}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={event => setTodoTitle(event.target.value)}
              // disabled={!todos}

            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              <TodoList
                todos={filteredTodos}
                tempTodo={tempTodo}
                title={todoTitle}
                onTitle={setTodoTitle}
                onDelete={deleteTodo}
                loadingTodos={loadingTodoIds}
              />
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <TodoFooter
                todos={filteredTodos}
                status={status}
                onStatus={setStatus}
                onClear={clearTodos}
              />
            </footer>
          </>
        )}
      </div>

      {error && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => (setError(null))}
          />

          <p>{error}</p>

          {/*
          Unable to update a todo */}
        </div>
      )}

    </div>
  );
};
