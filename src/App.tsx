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
    }, 4000);
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
      setTitle('');

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
  }, [title, user]);

  const handleDelete = useCallback(async (todoId: number) => {
    try {
      await deleteTodo(todoId);

      setTodos([...todos.filter(({ id }) => id !== todoId)]);
    } catch {
      setTodosError(TodosError.Deleting);
    }
  }, [todos, todosError]);

  const handleChangeInput = ({
    target: { value },
  }: React.ChangeEvent<HTMLInputElement>) => setTitle(value);

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
              onChange={handleChangeInput}
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
          todos={todos}
          filterType={filterType}
        />
      </div>
      <ErrorNotification errorContent={todosError} setError={setTodosError} />
    </div>
  );
};
