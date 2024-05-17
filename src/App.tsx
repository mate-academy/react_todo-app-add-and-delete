/* eslint-disable @typescript-eslint/no-shadow */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Todo } from './types/Todo';
import { TodoComponent } from './components/Todo/todo.component';
import { TodoStatus } from './components/Filter/filter.status';
import { ErrorTypes } from './components/Errors/error';
import * as Services from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorTitle, setErrorTitle] = useState<string | null>(null);
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.All);
  const [newTodoTitle, setNewTodoTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    Services.getTodos()
      .then(setTodos)
      .catch(() => setErrorTitle(ErrorTypes.UnableToLoadTodos));
  }, []);

  useEffect(() => {
    if (errorTitle !== null) {
      setTimeout(() => setErrorTitle(null), 3000);
    }
  }, [errorTitle]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [todos, errorTitle]);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmedTitle = newTodoTitle.trim();

    if (!trimmedTitle) {
      setErrorTitle(ErrorTypes.TitleError);

      return;
    }

    const newTempTodo: Todo = {
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: Services.USER_ID,
    };

    setTempTodo(newTempTodo);
    setIsLoading(true);

    Services.createTodo(trimmedTitle, Services.USER_ID)
      .then(newTodo => {
        setTempTodo(null);
        setTodos(prevTodos => [
          ...prevTodos.filter(todo => todo.title !== trimmedTitle),
          newTodo,
        ]);
        setNewTodoTitle('');
      })
      .catch(() => {
        setErrorTitle(ErrorTypes.UnableToAddTodo);
        setTempTodo(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleStatus = (status: TodoStatus) => {
    setStatus(status);
  };

  const handleTodoChange = (updatedTodo: Partial<Todo> & { id: number }) => {
    setTodos(state =>
      state.map(todo =>
        todo.id === updatedTodo.id ? { ...todo, ...updatedTodo } : todo,
      ),
    );
  };

  const handleToggleAll = useCallback(() => {
    const allCompleted = todos.every(todo => todo.completed);
    const newCompletedState = !allCompleted;

    setIsLoading(true);
    Promise.all(
      todos.map(todo =>
        Services.updateTodo(todo.id, { completed: newCompletedState })
          .then(() => ({ ...todo, completed: newCompletedState }))
          .catch(() => {
            setErrorTitle(ErrorTypes.UnableToUpdateTodo);

            return todo;
          }),
      ),
    )
      .then(updatedTodos => {
        setTodos(updatedTodos);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [todos]);

  const filteredTodos = useMemo(() => {
    switch (status) {
      case TodoStatus.Active:
        return todos.filter(todo => !todo.completed);
      case TodoStatus.Completed:
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [status, todos]);

  const hasCompletedTodos = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const handleDeleteTodo = (deletedTodoId: number) => {
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== deletedTodoId));
  };

  const handleDeleteCompleted = () => {
    todos.forEach(todo => {
      if (!todo.completed) {
        return;
      }

      Services.deleteTodo(todo.id)
        .then(() => {
          setTodos(prevTodo =>
            prevTodo.filter(currTodo => currTodo.id !== todo.id),
          );
        })
        .catch(() => {
          setErrorTitle(ErrorTypes.UnableToDeleteTodo);
        });
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              onClick={handleToggleAll}
              type="button"
              className={`todoapp__toggle-all ${todos.every(todo => todo.completed) ? 'active' : ''}`}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              disabled={isLoading}
            />
          </form>
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoComponent
              key={todo.id}
              todo={todo}
              onTodoChange={handleTodoChange}
              onDeleteTodo={handleDeleteTodo}
              onError={errorMessage => setErrorTitle(errorMessage)}
            />
          ))}
          {tempTodo && (
            <TodoComponent
              todo={tempTodo}
              isTemp={true}
              onTodoChange={handleTodoChange}
              onError={errorMessage => setErrorTitle(errorMessage)}
              onDeleteTodo={handleDeleteTodo}
            />
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todos.reduce((acc, curr) => acc + Number(!curr.completed), 0)} items left`}
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={
                  status === TodoStatus.All
                    ? 'filter__link selected'
                    : 'filter__link'
                }
                data-cy="FilterLinkAll"
                onClick={() => handleStatus(TodoStatus.All)}
              >
                All
              </a>

              <a
                href="#/active"
                className={
                  status === TodoStatus.Active
                    ? 'filter__link selected'
                    : 'filter__link'
                }
                data-cy="FilterLinkActive"
                onClick={() => handleStatus(TodoStatus.Active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={
                  status === TodoStatus.Completed
                    ? 'filter__link selected'
                    : 'filter__link'
                }
                data-cy="FilterLinkCompleted"
                onClick={() => handleStatus(TodoStatus.Completed)}
              >
                Completed
              </a>
            </nav>
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!hasCompletedTodos}
              onClick={handleDeleteCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal${errorTitle ? '' : ' hidden'}`}
      >
        {errorTitle}
        <button
          onClick={() => setErrorTitle(null)}
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />
      </div>
    </div>
  );
};
