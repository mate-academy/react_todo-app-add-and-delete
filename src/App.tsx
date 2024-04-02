import React, { useState, useEffect, useRef } from 'react';

import { UserWarning } from './UserWarning';
import { USER_ID, createTodo, getTodos, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { Errors } from './types/Errors';
import { FilterBy } from './types/FiilterBy';
import { ErrorNotification } from './ErrorNotification';

type FilterTheTodos = (todos: Todo[], filterBy: FilterBy) => Todo[];

const getFilteredTodos: FilterTheTodos = (todos, filterBy) => {
  let filteredTodos = todos;

  if (filterBy !== FilterBy.All) {
    filteredTodos = filteredTodos.filter(todo => {
      switch (filterBy) {
        case FilterBy.Active:
          return !todo.completed;
        case FilterBy.Completed:
          return todo.completed;
        default:
          throw new Error('Unknown filter type');
      }
    });
  }

  return filteredTodos;
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<Errors | null>(null);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [titleText, setTitleText] = useState('');
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Errors.Load);
      });
  }, []);

  useEffect(() => {
    if (errorMessage) {
      setTimeout(() => setErrorMessage(null), 3000);
    }
  }, [errorMessage]);

  const handleClearingError = () => setErrorMessage(null);
  const handleChangingFilterBy = (value: FilterBy) => setFilterBy(value);
  const handleClearingCompletedTodos = () =>
    setTodos(currentTodos => currentTodos.filter(todo => !todo.completed));

  const visibleTodos = getFilteredTodos(todos, filterBy);

  const activeTodosCount: number = todos.filter(todo => !todo.completed).length;

  const addTodo = ({ title }: Todo) => {
    if (!title.trim()) {
      setErrorMessage(Errors.Empty);

      return;
    }

    setTempTodo({ id: 0, title, userId: USER_ID, completed: false });

    createTodo({
      title,
      userId: USER_ID,
      completed: false,
    })
      .then(newTodo => {
        setTempTodo(null);
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTitleText('');
      })
      .catch(() => {
        setErrorMessage(Errors.Load);
        setTempTodo(null);
      })
      .finally(() => {
        inputRef.current?.focus();
      });
  };

  const deleteTodo = (id: number) => {
    removeTodo(id);
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form
            onSubmit={() =>
              addTodo({
                title: titleText,
                id: 0,
                userId: 378,
                completed: false,
              })
            }
          >
            <input
              data-cy="NewTodoField"
              type="text"
              disabled={Boolean(tempTodo)}
              ref={inputRef}
              value={titleText}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={event => setTitleText(event.target.value)}
            />
          </form>
        </header>

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              onDelete={deleteTodo}
            />

            <Footer
              onFilterClick={handleChangingFilterBy}
              activeTodosCount={activeTodosCount}
              onClearCompleted={handleClearingCompletedTodos}
              selectedFilterBy={filterBy}
            />
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onDeleteClick={handleClearingError}
      />
    </div>
  );
};
