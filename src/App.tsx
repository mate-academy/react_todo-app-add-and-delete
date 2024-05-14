/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useMemo, useState } from 'react';
import { Todo } from './types/Todo';
import TodoService from './services/todo';
import { TodoComponent } from './components/Todo/todo.component';
import { TodoStatus } from './components/Filter/filter.status';
import { ErrorTypes } from './components/Errors/error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorTitle, setErrorTitle] = useState<string | null>(null);
  const [status, setStatus] = useState<TodoStatus>(TodoStatus.All);

  useEffect(() => {
    TodoService.getTodos()
      .then(setTodos)
      .catch(() => setErrorTitle(ErrorTypes.UnableToLoadTodos));
  }, []);

  useEffect(() => {
    if (errorTitle !== null) {
      setTimeout(() => setErrorTitle(null), 3000);
    }
  }, [errorTitle]);

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newTodoField = event.currentTarget.value;

    if (!newTodoField) {
      setErrorTitle(ErrorTypes.TitleError);

      return;
    }
  };

  const handleStatus = (status: TodoStatus) => {
    setStatus(status);
  };

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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
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
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoComponent key={todo.id} todo={todo} />
          ))}
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
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorTitle ? '' : 'hidden'}`}
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
