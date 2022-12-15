/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Errors } from './components/Errors/Errors';
import { Filter } from './components/Filter/Filter';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorsType } from './types/ErrorsType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | ErrorsType>('');
  const [filterParam, setFilter] = useState('All');
  const [isAdding, setIsAdding] = useState(false);
  const newTodoField = useRef<HTMLInputElement>(null);

  const complitedTodos = useMemo(() => (
    todos.filter(todo => todo.completed)
  ), [todos]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const loadTodos = useCallback(() => {
    if (!user) {
      return;
    }

    getTodos(user.id).then(setTodos);
  }, [user]);

  useEffect(() => {
    loadTodos();
  }, [user]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!title.trim()) {
        setError(ErrorsType.Title);

        return;
      }

      if (user) {
        setIsAdding(true);

        try {
          await addTodo({
            userId: user.id,
            title,
            completed: false,
          });

          await loadTodos();
        } catch {
          setError(ErrorsType.Load);
        } finally {
          setIsAdding(false);
        }
      } else {
        setError(ErrorsType.Add);
      }

      setTitle('');
    }, [user, title],
  );

  const handleDelete = useCallback(
    async (deletingTodoId: number) => {
      setIsAdding(true);

      try {
        await deleteTodo(deletingTodoId);
        loadTodos();
      } catch {
        setError(ErrorsType.Delete);
      } finally {
        setIsAdding(false);
      }
    }, [],
  );

  const handleClearCompleted = useCallback(
    async () => {
      setIsAdding(true);

      try {
        complitedTodos.map(todo => (
          deleteTodo(todo.id)
        ));
        loadTodos();
      } catch {
        setError(ErrorsType.Delete);
      } finally {
        setIsAdding(false);
      }
    }, [],
  );

  const filteredTodos = todos.filter(todo => {
    switch (filterParam) {
      case 'Active':
        return !todo.completed;

      case 'Completed':
        return todo.completed;

      case 'All':
      default:
        return todo;
    }
  });

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length > 0 && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all active"
            />
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isAdding}
            />
          </form>
        </header>

        <TodoList
          todos={filteredTodos}
          onDelete={handleDelete}
          isAdding={isAdding}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="todosCounter">
              {`${todos.length} items left`}
            </span>

            <Filter
              filterParam={filterParam}
              onSetFilter={setFilter}
            />

            {complitedTodos.length > 0 && (
              <button
                data-cy="ClearCompletedButton"
                type="button"
                className="todoapp__clear-completed"
                onClick={handleClearCompleted}
              >
                Clear completed
              </button>
            )}
          </footer>
        )}
      </div>

      <Errors
        error={error}
        onSetError={setError}
      />
    </div>
  );
};
