/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import { useEffect, useState, useCallback } from 'react';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { TodoList } from './components/TodoList';
import { FilteredTodo } from './components/FilteredTodo';
import { Filter } from './types/Filter';
import { Todo } from './types/Todo';
import { UserWarning } from './UserWarning';
import { TodoForm } from './components/CreateTodoForm';

const USER_ID = 10400;

export const App: React.FC = () => {
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>(Filter.ALL);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<Todo | null>(null);
  const [isTodoCreate, setIsTodoCreate] = useState(false);

  const handleTodoCreate = useCallback(async (title: string) => {
    if (!title) {
      setError('Title is empty, Why bro?????');

      return;
    }

    setIsTodoCreate(true);

    const todo = {
      userId: USER_ID,
      title,
      completed: false,
    };

    try {
      const createdTodo = await createTodo(todo);

      setTodos((prevTodos) => [...prevTodos, createdTodo]);
    } catch ({ message }) {
      setError(`Error ${message}`);
    } finally {
      setIsTodoCreate(false);
      setNewTodo(null);
    }
  }, []);

  const handleDelete = useCallback(async () => {
    const completedTodoIds = todos
      .filter((todo) => todo.completed)
      .map((todo) => todo.id);

    try {
      await Promise.all(completedTodoIds.map((todoId) => deleteTodo(todoId)));

      const updatedTodos = todos.filter((todo) => !todo.completed);

      setTodos(updatedTodos);
    } catch ({ message }) {
      setError(`Error ${message}}`);
    }
  }, [todos]);

  useEffect(() => {
    getTodos(USER_ID)
      .then((fetchedTodos: Todo[]) => {
        setTodos(fetchedTodos);
      })
      .catch((fetchedError: Error) => {
        setError(fetchedError?.message ?? 'Something went wrong');
      });
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (error) {
      timeout = setTimeout(() => {
        setError(null);
      }, 3000);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [error]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter((todo) => {
    switch (filter) {
      case Filter.ACTIVE:
        return !todo.completed;

      case Filter.COMPLETED:
        return todo.completed;

      default:
        return true;
    }
  });

  const isDeleteBtn = todos.some((todo) => todo.completed);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button type="button" className="todoapp__toggle-all active" />

          <TodoForm
            inputDisabled={isTodoCreate}
            onFormSubmit={handleTodoCreate}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          newTodo={newTodo}
          setTodos={setTodos}
          setError={setError}
        />

        <footer className="todoapp__footer">
          <span className="todo-count">3 items left</span>

          <FilteredTodo filter={filter} onFilterChange={setFilter} />

          {isDeleteBtn && (
            <button
              type="button"
              className="todoapp__clear-completed"
              onClick={handleDelete}
            >
              Clear All completed tasks
            </button>
          )}
        </footer>
      </div>

      <div
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: !error },
        )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => setError(null)}
        />
        {error}
      </div>
    </div>
  );
};
