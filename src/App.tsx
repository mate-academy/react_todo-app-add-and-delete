import {
  ChangeEvent,
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { USER_ID, deleteTodo, getTodos, uploadTodo } from './api/todos';
import { TodoItem } from './components/Todo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

enum Errors {
  LOAD_TODOS = 'Unable to load todos',
  VALIDATION = 'Title should not be empty',
  ADD = 'Unable to add a todo',
  DELETE = 'Unable to delete a todo',
  UPDATE = 'Unable to update a todo',
}

enum TodoStatus {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

const TodoStatusRoutes: Record<TodoStatus, string> = {
  [TodoStatus.All]: '/',
  [TodoStatus.Active]: '/active',
  [TodoStatus.Completed]: '/completed',
};

const emptyTodo: Todo = {
  id: 0,
  completed: false,
  userId: USER_ID,
  title: '',
};

const errorDelay = 3000;

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [todoTitle, setTodoTitle] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [processingsTodos, setProcessingsTodos] = useState<number[]>([]);
  const [error, setError] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<TodoStatus>(
    TodoStatus.All,
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const focusInputField = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const filteringTodosByActiveStatus = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  const filteringTodosByCompletedStatus = useMemo(
    () => todos.filter(todo => todo.completed),
    [todos],
  );

  const filteringTodosByStatus = useMemo(() => {
    switch (selectedStatus) {
      case TodoStatus.Active:
        return filteringTodosByActiveStatus;

      case TodoStatus.Completed:
        return filteringTodosByCompletedStatus;

      default:
        return todos;
    }
  }, [
    filteringTodosByActiveStatus,
    filteringTodosByCompletedStatus,
    selectedStatus,
    todos,
  ]);

  const changeTodoTitleHandler = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setError('');
      setTodoTitle(e.target.value);
    },
    [],
  );

  const addTodo = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (!todoTitle.trim().length) {
        setError(Errors.VALIDATION);

        return;
      }

      setIsLoading(true);
      setError('');

      const newTempTodo: Todo = { ...emptyTodo, title: todoTitle.trim() };

      setTempTodo(newTempTodo);
      setProcessingsTodos([newTempTodo.id]);

      try {
        const todo = await uploadTodo({
          ...emptyTodo,
          title: todoTitle.trim(),
        });

        setTodos(currentTodos => [...currentTodos, todo]);
        setTodoTitle('');
      } catch {
        setError(Errors.ADD);
      } finally {
        setIsLoading(false);
        setTempTodo(null);
        setProcessingsTodos([]);
        focusInputField();
      }
    },
    [todoTitle],
  );

  const removeTodo = useCallback((id: number) => {
    setError('');
    setProcessingsTodos(prev => [...prev, id]);

    deleteTodo(id)
      .then(() =>
        setTodos(currentTodos => currentTodos.filter(todo => todo.id !== id)),
      )
      .catch(() => setError(Errors.DELETE))
      .finally(() => {
        setProcessingsTodos(prev => prev.filter(prevItem => prevItem !== id));
        focusInputField();
      });
  }, []);

  const removeTodos = useCallback(async () => {
    setIsLoading(true);
    setError('');

    const deletePromises = filteringTodosByCompletedStatus.map(todo => {
      setProcessingsTodos(prev => [...prev, todo.id]);

      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(t => t.id !== todo.id));
        })
        .catch(() => {
          setError(Errors.DELETE);
        })
        .finally(() => {
          setProcessingsTodos(prev =>
            prev.filter(prevItem => prevItem !== todo.id),
          );
          focusInputField();
        });
    });

    await Promise.allSettled(deletePromises);
    setIsLoading(false);
  }, [filteringTodosByCompletedStatus]);

  const selectedStatusTodosHandler = useCallback((todoStatus: TodoStatus) => {
    setSelectedStatus(todoStatus);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setError('');
    }, errorDelay);

    return () => clearTimeout(timer);
  }, [error]);

  useEffect(() => {
    focusInputField();
  }, [todoTitle, todos, selectedStatus]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setError(Errors.LOAD_TODOS));
    focusInputField();
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={addTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              ref={inputRef}
              value={todoTitle}
              onChange={changeTodoTitleHandler}
              disabled={isLoading}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {filteringTodosByStatus.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoItem
                  todo={todo}
                  isActive={processingsTodos.includes(todo.id)}
                  removeTodo={() => removeTodo(todo.id)}
                />
              </CSSTransition>
            ))}
            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TodoItem todo={tempTodo} isActive={true} />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {/* Hide the footer if there are no todos */}
        {(todos.length !== 0 || tempTodo) && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {filteringTodosByActiveStatus.length} items left
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter">
              {Object.keys(TodoStatusRoutes).map(status => (
                <a
                  key={status}
                  href={`#${TodoStatusRoutes[status as TodoStatus]}`}
                  className={classNames('filter__link', {
                    selected: selectedStatus === status,
                  })}
                  data-cy={`FilterLink${status}`}
                  onClick={() =>
                    selectedStatusTodosHandler(status as TodoStatus)
                  }
                >
                  {status}
                </a>
              ))}
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              disabled={filteringTodosByCompletedStatus.length === 0}
              onClick={removeTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: error === '' },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setError('')}
        />
        {error}
      </div>
    </div>
  );
};
