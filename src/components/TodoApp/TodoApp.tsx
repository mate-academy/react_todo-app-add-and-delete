import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import './TodoApp.scss';
import { Filter } from '../Filter';
import { TodoList } from '../TodoList';
import { useTodos } from '../../TodosProvider/useTodos';
import { FilterType } from '../../types/FilterType';
import { ActionType } from '../../types/ActionType';
import { filterTodos } from './filterTodos';
import { getTodos, addTodo, USER_ID, deleteTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';

export const TodoApp: React.FC = () => {
  const { todos, setTodos } = useTodos();
  const [filter, setFilter] = useState(FilterType.All);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getTodos()
      .then(res => setTodos({ type: ActionType.GetTodos, payload: res }))
      .catch(() => setErrorMessage('Unable to load todos'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos]);

  const areAllCompleted = todos.every(({ completed }) => completed);
  const uncompletedTodos = todos.filter(({ completed }) => !completed);
  const completedTodos = todos.filter(({ completed }) => completed);
  const filteredTodos = useMemo(
    () => filterTodos(todos, filter),
    [todos, filter],
  );

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (!normalizedTitle) {
      setErrorMessage('Title should not be empty');

      return;
    }

    if (inputRef.current) {
      inputRef.current.disabled = true;
    }

    const newTodo: Omit<Todo, 'id'> = {
      title: normalizedTitle,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({
      id: 0,
      ...newTodo,
    });

    setLoadingTodos(current => [...current, 0]);

    addTodo(newTodo)
      .then(res => {
        setTodos({
          type: ActionType.AddTodo,
          payload: res,
        });
        setTitle('');
      })
      .catch(() => setErrorMessage('Unable to add a todo'))
      .finally(() => {
        if (inputRef.current) {
          inputRef.current.disabled = false;
          inputRef.current.focus();
        }

        setTempTodo(null);
        setLoadingTodos(current => current.filter(todoId => todoId !== 0));
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setLoadingTodos(current => [...current, todoId]);

    deleteTodo(todoId)
      .then(() => setTodos({ type: ActionType.DeleteTodo, payload: todoId }))
      .catch(() => setErrorMessage('Unable to delete a todo'))
      .finally(() =>
        setLoadingTodos(current =>
          current.filter(deletingTodoId => deletingTodoId !== todoId),
        ),
      );
  };

  const handleDeleteAllCompleted = () => {
    const completedTodosIds = completedTodos.map(({ id }) => id);
    const requests: Promise<unknown>[] = [];

    completedTodosIds.forEach(id => requests.push(deleteTodo(id)));

    setLoadingTodos(current => [...current, ...completedTodosIds]);

    completedTodos.forEach(todo => handleDeleteTodo(todo.id));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {!!todos.length && (
            <button
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: areAllCompleted,
              })}
              data-cy="ToggleAllButton"
              onClick={() =>
                setTodos({
                  type: ActionType.LeadToOneStatus,
                  payload: !areAllCompleted,
                })
              }
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value.trimStart())}
              ref={inputRef}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          tempTodo={tempTodo}
          onDelete={handleDeleteTodo}
          loadingTodos={loadingTodos}
        />

        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {uncompletedTodos.length} items left
            </span>

            <Filter filter={filter} onChange={setFilter} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleDeleteAllCompleted}
              disabled={completedTodos.length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMessage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
        {/*
        <br />
        Unable to update a todo} */}
      </div>
    </div>
  );
};
