import React, {
  useEffect, useMemo, useRef, useState,
} from 'react';
import classNames from 'classnames';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import * as TodoService from './api/todos';
import { Errors } from './types/Error';

const USER_ID = 11706;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(Filter.All);
  const [title, setTitle] = useState('');
  const [isError, setIsError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [isError, todos.length]);

  useEffect(() => {
    TodoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      });
  }, []);

  const filteredTodos: Todo[] = useMemo(() => {
    let preparedTodos = [...todos];

    if (filter !== Filter.All) {
      preparedTodos = preparedTodos.filter(todo => {
        switch (filter) {
          case Filter.Active:
            return !todo.completed;

          case Filter.Completed:
            return todo.completed;

          default:
            return true;
        }
      });
    }

    return preparedTodos;
  }, [todos, filter]);

  // const activeTodos = todos.filter(todo => !todo.completed).length;

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      return setErrorMessage(Errors.title);
    }

    const newTodo = {
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    setTempTodo(newTodo);
    setIsError(true);

    return TodoService.addTodo(newTodo)
      .then((finalTodo: Todo) => {
        setTodos(currentTodo => [...currentTodo, finalTodo]);
        setTitle('');
      })
      .catch(() => setErrorMessage(Errors.add))
      .finally(() => {
        setIsError(false);
        setTempTodo(null);
      });
  };

  const deleteTodo = (todoId: number) => {
    setIsLoading(currentTodo => [...currentTodo, todoId]);

    TodoService.deleteTodo(todoId)
      .then(() => setTodos(currentTodo => currentTodo
        .filter(todo => todo.id !== todoId)))
      .catch(() => setErrorMessage(Errors.delete))
      .finally(() => setIsLoading(currentTodo => currentTodo
        .filter((id: number) => id !== todoId)));
  };

  if (errorMessage) {
    setTimeout(() => setErrorMessage(''), 3000);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              data-cy="ToggleAllButton"
              aria-label="Toggle All"
              disabled={isError}
            />
          )}

          <form
            action="/"
            method="POST"
            onSubmit={handleSubmit}
          >
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              disabled={isError}
              onChange={(event) => setTitle(event.target.value)}
              ref={inputRef}
            />
          </form>
        </header>

        {filteredTodos.length > 0 && (
          <TodoList
            todos={filteredTodos}
            deleteTodo={deleteTodo}
            isLoading={isLoading}
            tempTodo={tempTodo}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            setTodos={setTodos}
            filter={filter}
            setFilter={setFilter}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage}
          aria-label="error"
        />
        {errorMessage}
      </div>
    </div>
  );
};
