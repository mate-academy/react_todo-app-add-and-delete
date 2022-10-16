/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  ChangeEvent, useContext, useMemo, useState,
} from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { addTodo, getTodos, removeTodo } from './api/todos';
import { TodoElement } from './components/TodoElement/TodoElement';
import { useDidUpdateEffect } from './utils/useDidUpdate';
import { ErrorMessage } from './types/ErrorMassage';
import { FilterType } from './types/FilterType';
import { todosFilter } from './utils/todosFilter';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const queryClient = useQueryClient();
  const user = useContext(AuthContext);
  const [hidden, setHidden] = useState(true);
  const [filterCriteria, setFilterCriteria] = useState(FilterType.All);
  const [error, setError] = useState(ErrorMessage.Null);
  const [newTodo, setNewTodo] = useState<string>('');

  const { data: todos, isLoading } = useQuery(
    ['todos', user?.id],
    () => getTodos(user!.id),
    {
      enabled: !!user,
    },
  );

  const todoMutation = useMutation(['todo'],
    addTodo,
    {
      onMutate: async (toDo) => {
        await queryClient.cancelQueries(['todos', user?.id]);

        const previousTodos = queryClient
          .getQueryData<Todo[]>(['todos', user?.id]);

        // Optimistically update to the new value
        if (previousTodos) {
          queryClient
            .setQueryData<Todo[]>(['todos', user?.id], [...previousTodos, {
            ...toDo,
            id: 0,
          }]);
        }

        return { previousTodos };
      },
      onSuccess: () => queryClient.invalidateQueries(['todos', user?.id]),
      onError: () => {
        setError(ErrorMessage.Add);
        setHidden(false);
      },
    });

  const removeTodoMutation = useMutation(['todo'], removeTodo, {
    onSuccess: () => queryClient.invalidateQueries(['todos', user?.id]),
    onError: () => {
      setError(ErrorMessage.Delete);
      setHidden(false);
    },
  });

  useDidUpdateEffect(() => {
    setTimeout(() => setHidden(true), 3000);
  }, [hidden]);

  const handleUpdate = () => {
    setError(ErrorMessage.Update);
    setHidden(false);
  };

  const handleDelete = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    removeTodoMutation.mutate(Number(event.currentTarget.value));
  };

  const handleDeleteAllCompleted = () => {
    if (todos) {
      todosFilter(FilterType.Completed, todos)
        .forEach((todo) => removeTodoMutation.mutate(todo.id));
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    setNewTodo(event.target.value);
  };

  const handleSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (newTodo.trim().length === 0) {
        setError(ErrorMessage.Add);
        setHidden(false);
        setNewTodo('');
      } else {
        todoMutation.mutate({
          title: newTodo,
          userId: user!.id,
          completed: false,
        });
        setNewTodo('');
      }
    }
  };

  const completed = todos?.some(todo => !todo.completed);

  const filteredTodos = useMemo(
    () => todos && todosFilter(filterCriteria, todos),
    [todos, filterCriteria],
  );

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
            onClick={handleUpdate}
          />

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodo}
              onKeyDown={handleSubmit}
              onChange={handleInput}
              disabled={todoMutation.isLoading}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          { isLoading && (
            <div data-cy="TodoLoader" className="modal overlay is-active">
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          )}
          {todos && filteredTodos?.map((todo) => (
            <TodoElement
              todo={todo}
              key={todo.id}
              handleDelete={handleDelete}
              handleUpdate={handleUpdate}
            />
          ))}
        </section>

        { !!todos?.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>

            <nav className="filter" data-cy="Filter">
              <a
                data-cy="FilterLinkAll"
                href="#/"
                className={classNames(
                  'filter__link',
                  { selected: filterCriteria === FilterType.All },
                )}
                onClick={(event) => {
                  event.preventDefault();
                  setFilterCriteria(FilterType.All);
                }}
              >
                All
              </a>

              <a
                data-cy="FilterLinkActive"
                href="#/active"
                className={classNames(
                  'filter__link',
                  { selected: filterCriteria === FilterType.Active },
                )}
                onClick={(event) => {
                  event.preventDefault();
                  setFilterCriteria(FilterType.Active);
                }}
              >
                Active
              </a>
              <a
                data-cy="FilterLinkCompleted"
                href="#/completed"
                className={classNames(
                  'filter__link',
                  { selected: filterCriteria === FilterType.Completed },
                )}
                onClick={(event) => {
                  event.preventDefault();
                  setFilterCriteria(FilterType.Completed);
                }}
              >
                Completed
              </a>
            </nav>

            <button
              data-cy="ClearCompletedButton"
              type="button"
              className={
                classNames(
                  'todoapp__clear-completed',
                  { hide: completed },
                )
              }
              onClick={handleDeleteAllCompleted}
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
          { hidden },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setHidden(true)}
        />
        {error === ErrorMessage.Add && 'Unable to add a todo'}
        {error === ErrorMessage.Delete && 'Unable to delete a todo'}
        {error === ErrorMessage.Update && 'Unable to update a todo'}
      </div>
    </div>
  );
};
