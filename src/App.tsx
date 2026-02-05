/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as todoService from './api/todos';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';
import classNames from 'classnames';
import { filterTodos } from './use_cases/filterTodos';
import { FilterState } from './enums/FilterState';
import { Header } from './components/Header';
import { TodoError } from './enums/TodoError';

// Переконайся, що у тебе є цей ID. Якщо ні - використовуй будь-яке число, наприклад 1.
const USER_ID = 111;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<TodoError>(TodoError.None);
  const [selectedFilter, setSelectedFilter] = useState<FilterState>(
    FilterState.All,
  );
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const errorTimerId = useRef<number>(0);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const showError = (message: TodoError) => {
    window.clearTimeout(errorTimerId.current);

    setErrorMessage(message);

    errorTimerId.current = window.setTimeout(() => {
      setErrorMessage(TodoError.None);
    }, 3000);
  };

  useEffect(() => {
    todoService
      .getTodos()
      .then(setTodos)
      .catch(() => showError(TodoError.LoadTodos));
  }, []);

  useEffect(() => {
    if (!tempTodo && inputRef.current) {
      inputRef.current.focus();
    }
  }, [tempTodo]);

  const filteredTodos = useMemo(
    () => filterTodos(selectedFilter, todos) || [],
    [todos, selectedFilter],
  );

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const handleAddTodo = async () => {
    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      showError(TodoError.EmptyTitle);

      return;
    }

    setTempTodo({
      id: 0,
      completed: false,
      title: trimmedTitle,
      userId: USER_ID,
    });

    try {
      const newTodo = await todoService.createTodo(trimmedTitle);

      setTodos(current => [...current, newTodo]);
      setTodoTitle('');
      setErrorMessage(TodoError.None);
    } catch {
      showError(TodoError.AddTodo);
    } finally {
      setTempTodo(null);
    }
  };

  const handleRemoveTodo = async (todoId: number) => {
    setProcessingIds(ids => [...ids, todoId]);

    try {
      await todoService.deleteTodo(todoId);
      setTodos(current => current.filter(todo => todo.id !== todoId));

      inputRef.current?.focus();
    } catch {
      showError(TodoError.DeleteTodo);
    } finally {
      setProcessingIds(ids => ids.filter(id => id !== todoId));
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      handleRemoveTodo(todo.id);
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          ref={inputRef}
          todoTitle={todoTitle}
          onTodoTitleChange={setTodoTitle}
          onAddTodo={handleAddTodo}
          disabled={!!tempTodo}
        />

        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem
              key={todo.id}
              todo={todo}
              onDelete={() => handleRemoveTodo(todo.id)}
              isProcessing={processingIds.includes(todo.id)}
            />
          ))}
          {tempTodo && <TodoItem key={0} todo={tempTodo} isProcessing={true} />}
        </section>

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodosCount} items left
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                href="#/"
                className={classNames('filter__link', {
                  selected: selectedFilter === FilterState.All,
                })}
                data-cy="FilterLinkAll"
                onClick={e => {
                  e.preventDefault();
                  setSelectedFilter(FilterState.All);
                }}
              >
                All
              </a>
              <a
                href="#/active"
                className={classNames('filter__link', {
                  selected: selectedFilter === FilterState.Active,
                })}
                data-cy="FilterLinkActive"
                onClick={e => {
                  e.preventDefault();
                  setSelectedFilter(FilterState.Active);
                }}
              >
                Active
              </a>
              <a
                href="#/completed"
                className={classNames('filter__link', {
                  selected: selectedFilter === FilterState.Completed,
                })}
                data-cy="FilterLinkCompleted"
                onClick={e => {
                  e.preventDefault();
                  setSelectedFilter(FilterState.Completed);
                }}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={
                !todos.some(t => t.completed) || processingIds.length > 0
              }
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: errorMessage === TodoError.None },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage(TodoError.None)}
        />
        {errorMessage}
      </div>
    </div>
  );
};
