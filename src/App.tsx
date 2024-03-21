/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { USER_ID, createTodo, deleteTodos, getTodos } from './api/todos';
import { TodoList } from './components/TodoList/TodoList';
import { Todo } from './types/Todo';
import { TodosFilter } from './components/TodosFilter/TodosFilter';
import { FilterStatus } from './types/FilterStatus';
import classNames from 'classnames';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean | string>(false);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [disabledInput, setDisabledInput] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>(
    FilterStatus.all,
  );

  const resetError = () => {
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage('Unable to load todos'))
      .finally(resetError);
  }, []);

  const todoField = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (todoField.current) {
      todoField.current.focus();
    }
  });

  const handleFilterChange = (status: FilterStatus) => {
    setFilterStatus(status);
  };

  const filteredTodos = todos.filter(todo => {
    switch (filterStatus) {
      case 'active':
        return !todo.completed;

      case 'completed':
        return todo.completed;

      default:
        return true;
    }
  });

  const addTodo = async (newTitle: string) => {
    setTempTodo({ id: 0, title: newTitle, completed: false, userId: USER_ID });
    setIsLoading('adding');
    setDisabledInput(true);

    return createTodo({
      title: newTitle.trim(),
      completed: false,
      userId: USER_ID,
    })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTempTodo(null);
      })
      .catch(error => {
        setTempTodo(null);

        if (error instanceof Error) {
          throw new Error('Unable to add a todo');
        }

        setErrorMessage((error as Error).message);
        throw error;
      })
      .finally(() => {
        resetError();
        setIsLoading(false);
        setDisabledInput(false);
      });
  };

  const removeTodo = async (id: number) => {
    setIsLoading('deleting');

    return deleteTodos(id)
      .then(() => setTodos(todos.filter(todo => todo.id !== id)))
      .catch(() => {
        setTodos(todos);
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        resetError();
        setIsLoading(false);
      });
  };

  const handleClearCompleted = async () => {
    const completedTodosIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setIsLoading('completed');

    try {
      await Promise.all(
        completedTodosIds.map(async id => {
          try {
            setIsLoading('completed');
            await deleteTodos(id);
            setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
          } catch (error) {
            setErrorMessage('Unable to delete a todo');
          } finally {
            setIsLoading(false);
          }
        }),
      );
    } finally {
      setIsLoading(false);
      resetError();
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      if (title.trim()) {
        await addTodo(title);
        setTitle('');
      } else {
        throw new Error('Title should not be empty');
      }
    } catch (error) {
      setErrorMessage((error as Error).message);
    } finally {
      resetError();
    }
  };

  const activeTodos = todos.filter(todo => !todo.completed);
  const completedTodos = todos.filter(todo => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!filteredTodos.length && (
            <button
              type="button"
              className={classNames({
                'todoapp__toggle-all': true,
                active: !!completedTodos.length,
              })}
              data-cy="ToggleAllButton"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={todoField}
              value={title}
              onChange={e => setTitle(e.target.value)}
              disabled={disabledInput}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          removeTodo={removeTodo}
          tempTodo={tempTodo}
          isLoading={isLoading}
        />

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {activeTodos.length} items left
            </span>

            <TodosFilter
              filterStatus={filterStatus}
              onFilterChange={handleFilterChange}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={!completedTodos.length}
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames({
          'notification is-danger is-light has-text-weight-normal': true,
          hidden: !errorMessage.length,
        })}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorMessage}
      </div>
    </div>
  );
};
