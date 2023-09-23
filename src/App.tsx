/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/indent */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import cn from 'classnames';
import { TodoList } from './components/TodoList';
import { FooterFilter } from './components/FooterFilter';
import { Filter } from './types/Filter';
import { getTodos, deleteTodo, addTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Errors } from './types/Errors';

const USER_ID = 11551;

export const App: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('all');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<Errors | null>(null);
  const [title, setTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [deletedTodoId, setDeletedTodoId] = useState<number | null>(null);
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const fetchData = useMemo(() => async () => {
    try {
      const todoss = await getTodos(USER_ID);

      setTodos(todoss);
    } catch (e) {
      setError(Errors.load);
      setTimeout(() => setError(null), 3000);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFilter = useCallback((newFilter: Filter) => {
    setFilter(newFilter);
  }, []);

  const handleRemove = useCallback(async (todoId: number) => {
    try {
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
      setDeletedTodoId(todoId);
      await deleteTodo(todoId);
    } catch {
      setError(Errors.delete);
    }
  }, []);

  const onSubmit = useCallback(async () => {
    try {
      setIsAddingTodo(true);

      if (!title.trim()) {
        console.log('Title is empty. Showing error.');
        setError(Errors.noTitle);
        setTimeout(() => {
          setError(null);
        }, 3000);

        return;
      }

      const trimmedTitle = title.trim();

      const temporaryTodo = {
        id: +(new Date()),
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      };

      console.log('Setting temporary todo:', temporaryTodo);

      setTempTodo(temporaryTodo);

      const response = await addTodos({
        title: trimmedTitle,
        userId: USER_ID,
        completed: false,
      });

      console.log('Response from server:', response);

      setTitle('');
      setTempTodo(null);
      if (tempTodo !== null) {
        setTempTodo(response);
      } else {
        setTodos(prevTodos => [...prevTodos, response]);
      }

      setIsAddingTodo(false);
    } catch {
      console.error('Error during todo submission:', error);
      setError(Errors.add);
      setTimeout(() => {
        setError(null);
      }, 3000);
      setTempTodo(null);
      setIsAddingTodo(false);
    }
  }, [title, tempTodo, setTempTodo, setError, error]);

  const handleSubmit: React.FormEventHandler = useCallback((event) => {
    event.preventDefault();

    onSubmit();
  }, [onSubmit]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.filter(todo => !todo.completed).length !== 0
            && (
              <button
                type="button"
                className="todoapp__toggle-all active"
                data-cy="ToggleAllButton"
              />
            )}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              // eslint-disable-next-line jsx-a11y/no-autofocus
              ref={input => input && input.focus()}
              disabled={tempTodo !== null}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </form>
        </header>

        {todos
        && (
        <TodoList
          filter={filter}
          todos={todos}
          handleRemove={handleRemove}
          tempTodo={tempTodo}
          deletedTodoId={deletedTodoId}
          isAddingTodo={isAddingTodo}
        />
)}

        {todos.length !== 0
          && (
            <FooterFilter handleFilter={handleFilter} todos={todos} />
          )}

      </div>

      <div
        data-cy="ErrorNotification"
        className={cn('notification is-danger is-light has-text-weight-normal',
          { hidden: error === null })}
      >
        {error
          && (
            <button
              data-cy="HideErrorButton"
              type="button"
              className="delete"
              onClick={() => setError(null)}
            />
          )}
        {error}
      </div>
    </div>
  );
};

export default React.memo(App);
