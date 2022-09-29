import React, {
  FormEvent,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { addTodos, deleteTodo, getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/Page/ErrorNotification';
import { Footer } from './components/Page/Footer';
import { TodoList } from './components/Page/TodoList';
import { TodoContext } from './components/TodoContext';
import { TodosError } from './types/ErrorEnum';
import { FilterType } from './types/FilterTypeEnum';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useContext(TodoContext);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);
  const [title, setTitle] = useState<string>('');
  const [todosError, setTodosError] = useState<TodosError>(TodosError.None);

  if (todosError.length > 0) {
    setTimeout(() => {
      setTodosError(TodosError.None);
    }, 2000);
  }

  const loadTodos = useCallback((userId: number) => {
    getTodos(userId)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setTodosError(TodosError.Loading));
  }, [user, todos]);

  useEffect(() => {
    if (!user) {
      return;
    }

    loadTodos(user.id);
  }, [user]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const visibleTodos = filterType === FilterType.All
    ? todos
    : todos.filter(({ completed }) => {
      switch (filterType) {
        case FilterType.Active:
          return !completed;
        case FilterType.Completed:
          return completed;

        default:
          throw new Error();
      }
    });

  const handleChooseFilter = useCallback(
    (filter: FilterType) => {
      setFilterType(filter);
    },
    [filterType],
  );

  const handleSubmit = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setTodosError(TodosError.Title);

      return;
    }

    try {
      if (!user) {
        return;
      }

      const newTodo = await addTodos(user.id, title);

      setTodos([...todos, newTodo]);
    } catch {
      setTodosError(TodosError.Adding);
    }

    setTitle('');
  }, [title, user, title, todosError]);

  const handleDelete = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos([...visibleTodos.filter(({ id }) => id !== todoId)]);
    } catch {
      setTodosError(TodosError.Deleting);
    }
  }, [todos, todosError]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos && (
            <button
              data-cy="ToggleAllButton"
              type="button"
              className="todoapp__toggle-all active"
            >
              {null}
            </button>
          )}

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={title}
              onChange={({ target: { value } }) => setTitle(value)}
            />
          </form>
        </header>

        {todos && (
          <TodoList
            visibleTodos={visibleTodos}
            removeTodo={handleDelete}
          />
        )}

        <Footer
          handleChooseFilter={handleChooseFilter}
          todos={visibleTodos}
          filterType={filterType}
        />
      </div>
      {todosError.length > 0 && (
        <ErrorNotification errorContent={todosError} setError={setTodosError} />
      )}
    </div>
  );
};
