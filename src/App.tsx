/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  useCallback, useEffect, useState, FC, useMemo,
} from 'react';
import cn from 'classnames';
import {
  deleteTodo, getTodos, patchTodo, postTodo,
} from './api/todos';

import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem/TodoItem';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';

import { TodoData } from './types/TodoData';
import { ErrorBy } from './types/ErrorBy';
import { FilterBy } from './types/FilterBy';

const USER_ID = 10331;

export const App: FC = () => {
  const [todoTemp, setTodoTemp] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [typeOfFilter, setTypeOfFilter] = useState<FilterBy>(FilterBy.all);
  const [disableWriting, setDisableWriting] = useState(false);
  const [typeOfError, setTypeOfError] = useState<ErrorBy | null>(null);
  const [isError, setIsError] = useState(false);
  const [isClearCompletedTodos, setIsClearCompletedTodos] = useState(false);

  const completedTodos = useMemo(() => {
    return todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);
  }, [todos]);

  const numberOfItemsLeft = useMemo(() => (
    todos.filter(({ completed }) => !completed).length
  ), [todos]);

  const hasCompletedTodos = useMemo(() => (
    numberOfItemsLeft !== todos.length
  ), [todos]);

  const hasTodos = useMemo(() => todos.length > 0, [todos]);

  const visibleTodos = useMemo(() => {
    return todos.filter(({ completed }) => {
      switch (typeOfFilter) {
        case FilterBy.active:
          return !completed;
        case FilterBy.completed:
          return completed;
        default:
          return true;
      }
    });
  }, [todos]);

  const clearTitle = useCallback(() => setTitle(''), []);

  const loadTodos = useCallback(async () => {
    setIsError(false);
    setDisableWriting(true);

    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      setIsError(true);
      setTypeOfError(ErrorBy.loading);
    }

    setDisableWriting(false);
  }, []);

  const handleAddTodo = useCallback(async (
    event: React.ChangeEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const newTodo: TodoData = {
      userId: USER_ID,
      title,
      completed: false,
    };

    try {
      if (typeOfError === ErrorBy.loading || typeOfError === ErrorBy.adding) {
        setTypeOfError(ErrorBy.adding);
        throw new Error();
      }

      if (!title.trim()) {
        setTypeOfError(ErrorBy.todoIsEmpty);
        throw new Error();
      }

      const temporaryTodo = { ...newTodo, id: 0 };

      setTodoTemp(temporaryTodo);
      await postTodo(newTodo);
      await loadTodos();
      setTodoTemp(null);
    } catch {
      setIsError(true);
      setTypeOfError(ErrorBy.adding);
    }

    clearTitle();
  }, [title]);

  const handleDeleteTodo = useCallback(async (id: number) => {
    try {
      await deleteTodo(id);
      setIsClearCompletedTodos(false);
    } catch {
      setTypeOfError(ErrorBy.deleting);
      setIsError(true);
    }

    loadTodos();
  }, []);

  const deleteAllComplededTodos = useCallback(async () => {
    setIsClearCompletedTodos(true);

    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  }, [todos]);

  const handleUpdateTodoCompleted = useCallback(async (
    id: number, completed: boolean,
  ) => {
    await patchTodo(id, { completed: !completed });
    loadTodos();
  }, []);

  useEffect(() => {
    loadTodos();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {hasTodos && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: numberOfItemsLeft === 0,
              })}
            />
          )}

          <form onSubmit={handleAddTodo}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              disabled={disableWriting}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          completedTodos={completedTodos}
          isClearCompletedTodos={isClearCompletedTodos}
          onUpdateCompleted={handleUpdateTodoCompleted}
          onDelete={handleDeleteTodo}
        />

        {todoTemp && (
          <TodoItem
            todo={todoTemp}
            completedTodos={completedTodos}
            isClearCompletedTodos={isClearCompletedTodos}
            onUpdateCompleted={handleUpdateTodoCompleted}
            onDelete={handleDeleteTodo}
          />
        )}

        {hasTodos && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${numberOfItemsLeft} items left`}
            </span>

            <TodoFilter
              typeFilter={typeOfFilter}
              onFilter={setTypeOfFilter}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={deleteAllComplededTodos}
              hidden={!hasCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {isError && (
        <div className="notification is-danger is-light has-text-weight-normal">
          {/* Add the 'hidden' class to hide the message smoothly */}
          <button
            type="button"
            className="delete hidden"
            onClick={() => setIsError(false)}
          />

          {typeOfError}
        </div>
      )}
    </div>
  );
};
