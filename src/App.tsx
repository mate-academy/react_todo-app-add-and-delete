/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as TodoService from './api/todos';
import { FilterBy } from './types/FilterBy';
import { ErrorMessage } from './types/ErrorMessage';

const USER_ID = 11836;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [errorMessage, setErrorMessage]
  = useState<ErrorMessage>(ErrorMessage.None);
  const [todoInput, setTodoInput] = useState('');
  const focusRef = useRef<HTMLInputElement>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    TodoService.getTodos(USER_ID)
      .then((todosFromServer: React.SetStateAction<Todo[]>) => {
        setTodos(todosFromServer);
        setFilteredTodos(todosFromServer);
      })
      .catch((error) => {
        setErrorMessage(ErrorMessage.UnableToLoad);
        setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
        throw error;
      });
  }, []);

  useEffect(() => {
    if (!isSubmitting && focusRef.current) {
      focusRef.current.focus();
    }
  }, [isSubmitting]);

  const deleteTodo = (todoId: number) => {
    setIsSubmitting(true);

    TodoService.deleteTodos(todoId)
      .then(() => {
        setTodos(currentTodos => currentTodos
          .filter(todo => todo.id !== todoId));
        setFilteredTodos(currentFilteredTodos => currentFilteredTodos
          .filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDelete);
        setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
      })
      .finally(() => setIsSubmitting(false));
  };

  const clearCompletedTodos = () => {
    setIsSubmitting(true);

    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(todo => deleteTodo(todo.id)))
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToDelete);
        setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
      })
      .finally(() => setIsSubmitting(false));
  };

  const createTodo = (newTodo: Omit<Todo, 'id'>) => {
    setIsSubmitting(true);

    TodoService.createTodos(newTodo)
      .then((createdTodo) => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setTodoInput('');
        setTempTodo(null);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.UnableToAdd);
        setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);
        setTempTodo(null);
      })
      .finally(() => {
        setIsSubmitting(false);
        if (focusRef.current) {
          focusRef.current.focus();
        }
      });
  };

  const handleAddTodo = (event: React.FormEvent) => {
    event.preventDefault();
    const trimmedTitle = todoInput.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.TitleEmpty);
      setTimeout(() => setErrorMessage(ErrorMessage.None), 3000);

      return;
    }

    const newTempTodo = {
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTempTodo,
    });

    createTodo(newTempTodo);
  };

  useEffect(() => {
    switch (filterBy) {
      case FilterBy.Active:
        setFilteredTodos(todos.filter(todo => !todo.completed));
        break;
      case FilterBy.Completed:
        setFilteredTodos(todos.filter(todo => todo.completed));
        break;
      case FilterBy.All:
      default:
        setFilteredTodos(todos);
        break;
    }
  }, [filterBy, todos]);

  const handleFilterClick
  = (filterType: FilterBy) => (event: React.MouseEvent) => {
    event.preventDefault();
    setFilterBy(filterType);
  };

  const handleErrorNotificationClick = () => {
    setErrorMessage(ErrorMessage.None);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

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
          <form onSubmit={handleAddTodo}>
            <input
              disabled={isSubmitting}
              ref={focusRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoInput}
              onChange={(e) => setTodoInput(e.target.value)}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map((todo) => (
            <div key={todo.id} data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`}>
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={todo.completed}
                />
              </label>
              <span
                data-cy="TodoTitle"
                className="todo__title"
              >
                {todo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(todo.id)}
              >
                ×
              </button>
              <div data-cy="TodoLoader" className="modal overlay">
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          ))}
          {tempTodo && (
            <div
              key={tempTodo.id}
              data-cy="Todo"
              className={`todo ${tempTodo.completed ? 'completed' : ''}`}
            >
              <label className="todo__status-label">
                <input
                  data-cy="TodoStatus"
                  type="checkbox"
                  className="todo__status"
                  defaultChecked={tempTodo.completed}
                />
              </label>
              <span
                data-cy="TodoTitle"
                className="todo__title"
              >
                {tempTodo.title}
              </span>
              <button
                type="button"
                className="todo__remove"
                data-cy="TodoDelete"
                onClick={() => deleteTodo(tempTodo.id)}
              >
                ×
              </button>
              <div data-cy="TodoLoader" className={`modal overlay ${tempTodo ? 'is-active' : ''}`}>
                <div className="modal-background has-background-white-ter" />
                <div className="loader" />
              </div>
            </div>
          )}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>
            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                onClick={handleFilterClick(FilterBy.All)}
                className={`filter__link ${filterBy === FilterBy.All ? 'selected' : ''}`}
                data-cy="FilterLinkAll"
              >
                All
              </a>
              <a
                href="#/active"
                onClick={handleFilterClick(FilterBy.Active)}
                className={`filter__link ${filterBy === FilterBy.Active ? 'selected' : ''}`}
                data-cy="FilterLinkActive"
              >
                Active
              </a>
              <a
                href="#/completed"
                onClick={handleFilterClick(FilterBy.Completed)}
                className={`filter__link ${filterBy === FilterBy.Completed ? 'selected' : ''}`}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>
            {todos.some(todo => todo.completed) && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={clearCompletedTodos}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={`notification is-danger is-light has-text-weight-normal ${errorMessage === ErrorMessage.None ? 'hidden' : ''}`}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={handleErrorNotificationClick}
        />
        {errorMessage}
      </div>
    </div>
  );
};
