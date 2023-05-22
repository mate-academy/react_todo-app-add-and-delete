// #region IMPORTS
import {
  FC,
  useState,
  useEffect,
  useMemo,
  FormEvent,
  useCallback,
} from 'react';
import cn from 'classnames';
import {
  getTodos,
  createTodo,
  deleteTodo,
} from './api/sendRequest';
import { Status } from './enum/Status';
import { ErrorType } from './enum/ErrorType';
import { Todo } from './types/Todo';
import { TodoList } from './Components/TodoList/TodoList';
import { TodoStatus } from './Components/TodoFilter/TodoFilter';
// #endregion

const USER_ID = 10346;

export const App: FC = () => {
  // #region STATES & VARIABLES
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState(Status.All);
  const [todoListKey, setTodoListKey] = useState(0);
  const [errorType, setErrorType] = useState(ErrorType.None);
  const [isErrorNotification, setIsErrorNotification] = useState(false);
  const [isRemovingCompleted, setIsRemovingCompleted] = useState(false);

  const isNotEmptyArray = todos.length > 0;
  const isError = errorType !== ErrorType.None;
  const areAllCompleted = todos.every((todo) => todo.completed);
  // #endregion

  // #region ✅ ERRORS
  const setError = (typeOfError: ErrorType) => {
    setErrorType(typeOfError);
    setTimeout(() => setErrorType(ErrorType.None), 3000);
  };

  const errorMessage = useCallback(() => {
    switch (errorType) {
      case ErrorType.Fetch:
        return 'Unable to fetch a todo';

      case ErrorType.Add:
        return 'Unable to add a todo';

      case ErrorType.EmptyString:
        return 'Unable to add an empty todo';

      case ErrorType.Delete:
        return 'Unable to delete a todo';

      case ErrorType.Update:
        return 'Unable to update a todo';

      default:
        return 'Unexpected error';
    }
  }, [errorType]);
  // #endregion

  // #region ✅ FILTERS
  const visibleTodos = useMemo(() => (
    todos.filter(({ completed }) => {
      switch (status) {
        case Status.Active:
          return !completed;

        case Status.Completed:
          return completed;

        default:
          return true;
      }
    })
  ), [todos, status]);

  const filteredTodos = todos.filter((todo) => !todo.completed).length;
  // #endregion

  // #region ✅ Fetching & Updating Todos
  useEffect(() => {
    const fetchData = async () => {
      try {
        setTodos(await getTodos(USER_ID));
      } catch (error) {
        setError(ErrorType.Fetch);
        throw error;
      }
    };

    fetchData();
  }, []);

  const updateTodos = (newTodos: Todo[]) => {
    setTodos(newTodos);
  };

  const handleStatusChanged = (stats: Status) => {
    setStatus(stats);
  };
  // #endregion

  // #region ✅ Adding Todo
  const handleCreateTodo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const inputElement = event.currentTarget.elements[0] as HTMLFormElement;
    const newTodoTitle = inputElement.value.trim();

    if (!newTodoTitle) {
      setError(ErrorType.EmptyString);
      setIsErrorNotification(false);

      return;
    }

    try {
      const newTodo = {
        id: 0,
        userId: USER_ID,
        title: newTodoTitle,
        completed: false,
      };

      setTodos((prevTodos) => [...prevTodos, newTodo]);

      try {
        const createdTodo = await createTodo(newTodo.userId, newTodo);

        setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === newTodo.id
          ? { ...createdTodo }
          : todo)));

        inputElement.value = '';
        setTodoListKey((prevKey) => prevKey + 1);
      } catch (error) {
        setError(ErrorType.Add);
        setTimeout(() => {
          setTodos((prevTodos) => prevTodos
            .filter((todo) => todo.id !== newTodo.id));
        }, 3000);
      }
    } catch (error) {
      setIsErrorNotification(true);
    }
  };
  // #endregion

  // #region ✅ Deleting Todo & Clear Completed
  const handleTodoDeleted = useCallback(async (id: number) => {
    try {
      if (await deleteTodo(id)) {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      }
    } catch {
      setError(ErrorType.Delete);
    }
  }, []);

  const handleClearCompleted = useCallback(async () => {
    setIsRemovingCompleted(true);

    try {
      await Promise.all(
        todos
          .filter((todo) => todo.completed)
          .map((todo) => deleteTodo(todo.id)),
      );

      updateTodos(todos.filter((todo) => !todo.completed));
    } catch (error) {
      setError(ErrorType.Delete);
    } finally {
      setIsRemovingCompleted(false);
    }
  }, [todos]);
  // #endregion

  // #region RENDER
  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {isNotEmptyArray && (
            // eslint-disable-next-line jsx-a11y/control-has-associated-label
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: areAllCompleted,
              })}
            />
          )}

          <form onSubmit={handleCreateTodo}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <TodoList
          key={todoListKey}
          todos={visibleTodos}
          isDeleting={handleTodoDeleted}
          areAllRemoving={isRemovingCompleted}
        />

        {isNotEmptyArray && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${filteredTodos} items left`}
            </span>

            {todos.some((todo) => todo.completed) && (
              <>
                <TodoStatus
                  status={status}
                  onStatusChanged={handleStatusChanged}
                />

                <button
                  data-cy="ClearCompletedButton"
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={handleClearCompleted}
                >
                  Clear completed
                </button>
              </>
            )}
          </footer>
        )}

        {isError && !isErrorNotification && (
          <div className={cn(
            'notification', 'is-danger', 'is-light', 'has-text-weight-normal', {
              hidden: isErrorNotification,
            },
          )}
          >
            {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
            <button
              type="button"
              className="delete"
              onClick={() => setIsErrorNotification(true)}
            />
            {errorMessage()}
          </div>
        )}
      </div>
    </div>
  );
};
// #endregion
