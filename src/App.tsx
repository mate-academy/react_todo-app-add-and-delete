/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useState,
  useMemo,
  useCallback,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { Todo } from './types/Todo';
import {
  getTodos,
  addTodo,
  removeTodo,
} from './api/todos';
import { FilterType } from './types/FilterType';
import { ErrorNotification } from './types/ErrorNotification';
import { NewTodo } from './components/NewTodo/NewTodo';
import { TodoList } from './components/TodoList/TodoList';
import { FilterTodos } from './components/FilterTodos/FilterTodos';
import { Error } from './components/Error/Error';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState(FilterType.All);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(ErrorNotification.None);
  const [isAdding, setIsAdding] = useState(false);
  const [loadTodosIds, setLoadTodosIds] = useState<number[]>([]);

  const activeTodos = todos.filter(todo => !todo.completed);

  const completedTodos = todos.filter(todo => todo.completed);

  const loadingTodos = async () => {
    if (!user) {
      return;
    }

    const todosFromServer = await getTodos(user.id);

    setTodos(todosFromServer);
  };

  useEffect(() => {
    loadingTodos();
  }, []);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setError(ErrorNotification.None);

      if (title.trim() && user) {
        setIsAdding(true);

        try {
          await addTodo({
            userId: user.id,
            title: title.trim(),
            completed: false,
          });

          await loadingTodos();

          setTitle('');
        } catch {
          setError(ErrorNotification.Add);
        } finally {
          setIsAdding(false);
        }
      } else {
        setError(ErrorNotification.Title);
      }
    }, [title, user],
  );

  const handleRemove = useCallback(
    async (todoId: number) => {
      setError(ErrorNotification.None);
      setLoadTodosIds(prevIds => [...prevIds, todoId]);

      try {
        await removeTodo(todoId);

        await loadingTodos();
      } catch {
        setError(ErrorNotification.Remove);
      } finally {
        setLoadTodosIds([]);
      }
    }, [completedTodos],
  );

  const removeCompletedTodos = useCallback(
    async () => {
      setError(ErrorNotification.None);
      setLoadTodosIds(prevTodoIds => ([
        ...prevTodoIds,
        ...completedTodos.map(todo => todo.id),
      ]));

      try {
        await Promise.all(completedTodos.map(todo => (
          removeTodo(todo.id)
        )));

        await loadingTodos();
      } catch {
        setError(ErrorNotification.Remove);
      } finally {
        setLoadTodosIds([]);
      }
    }, [completedTodos],
  );

  const visibleTodos = useMemo(() => (
    todos.filter(todo => {
      switch (filter) {
        case FilterType.Completed:
          return todo.completed;

        case FilterType.Active:
          return !todo.completed;

        case FilterType.All:
        default:
          return todo;
      }
    })
  ), [todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className={classNames('todoapp__toggle-all', {
                active: !activeTodos.length,
              })}
            />
          )}

          <NewTodo
            onSubmit={handleSubmit}
            title={title}
            onTitleChange={setTitle}
            isAdding={isAdding}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          isAdding={isAdding}
          onDelete={handleRemove}
          loadingTodoIds={loadTodosIds}
          currentTitle={title}
        />

        {!todos.length || (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <FilterTodos
              filter={filter}
              onFilterChange={setFilter}
            />

            {completedTodos.length > 0 && (
              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                onClick={removeCompletedTodos}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <Error
        error={error}
        onErrorChange={setError}
      />
    </div>
  );
};
