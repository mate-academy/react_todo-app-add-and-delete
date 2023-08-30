/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { SortBy } from './types/SortBy';
import { addTodo, deleteTodo } from './api/todos';
import { Todos } from './components/Todos';
import { useGetTodos } from './hooks';
import { Errors } from './types';

const USER_ID = 11361;

export const App: React.FC = () => {
  const [sortBy, setSortBy] = useState<SortBy>(SortBy.all);
  const [selectedTodo, setSelectedTodo] = useState<number[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoadingTodo, setIsLoadingTodo] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const {
    isLoading,
    todos,
    errorMessage,
    todosNotCompleted,
    handleError,
    handleIsTodoDeleted,
  } = useGetTodos(USER_ID, tempTodo);

  const deleteOneTodo = async (todoId: number) => {
    try {
      await deleteTodo(USER_ID, todoId);
    } catch (error) {
      handleError(Errors.delete);
    }

    handleIsTodoDeleted(true);
    setSelectedTodo(prevSelectedTodo => [...prevSelectedTodo, todoId]);
  };

  const handleDeleteTodo = (value: number) => deleteOneTodo(value);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (!inputValue.trim()) {
        handleError(Errors.emptyTitle);
      } else {
        setIsLoadingTodo(true);

        setTempTodo({
          id: 0,
          userId: 11361,
          title: inputValue,
          completed: false,
        });

        const todo = {
          id: 0,
          userId: 11361,
          title: inputValue,
          completed: false,
        };

        try {
          await addTodo(USER_ID, todo);
        } catch (error) {
          handleError(Errors.add);
        } finally {
          setIsLoadingTodo(false);
          setTempTodo(null);
        }
      }

      setInputValue('');
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <form>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoadingTodo}
            />
          </form>
        </header>

        <Todos
          todos={todos}
          tempTodo={tempTodo}
          sortBy={sortBy}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={isLoading}
          selectedTodo={selectedTodo}
        />

        <footer className="todoapp__footer">
          <span className="todo-count">
            {todosNotCompleted}
            {' '}
            items left
          </span>

          <nav className="filter">
            <a
              href="#/"
              className={sortBy === 'all'
                ? 'filter__link selected'
                : 'filter__link'}
              onClick={() => setSortBy(SortBy.all)}
            >
              All
            </a>

            <a
              href="#/active"
              className={sortBy === 'active'
                ? 'filter__link selected'
                : 'filter__link'}
              onClick={() => setSortBy(SortBy.active)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={sortBy === 'completed'
                ? 'filter__link selected'
                : 'filter__link'}
              onClick={() => setSortBy(SortBy.completed)}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            data-cy="ClearCompletedButton"
            className="todoapp__clear-completed"
            disabled={todosNotCompleted === todos.length}
            onClick={() => {
              todos.forEach(todo => {
                if (todo.completed === true) {
                  deleteOneTodo(todo.id);
                }
              });
            }}
          >
            Clear completed
          </button>

        </footer>
      </div>

      <div
        className={errorMessage
          ? 'notification is-danger is-light has-text-weight-normal'
          : 'notification is-danger is-light has-text-weight-normal hidden'}
      >
        <button
          type="button"
          className="delete"
          onClick={() => handleError(Errors.noEroor)}
        />

        {errorMessage}
      </div>
    </div>
  );
};
