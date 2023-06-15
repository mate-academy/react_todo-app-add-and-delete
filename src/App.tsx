/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable max-len */
import {
  FC,
  ChangeEvent,
  FormEvent,
  useEffect,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import './App.scss';
import { UserWarning } from './UserWarning';
import { getTodos, removeTodo, setTodoToServer } from './api/todos';
import { TodosList } from './components/TodosList/TodosList';
import { Todo } from './types/Todo';
import { ErrorInfo } from './components/ErrorInfo/ErrorInfo';
import {
  visibleTodos,
  FilterForTodo,
  updateIsValidData,
  getCompletedTodosIds,
} from './utils/todoUtils';

const USER_ID = 10725;

export const App: FC = () => {
  const windowRef = useRef<HTMLInputElement | null>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [completedTodosId, setCompletedTodosId] = useState<number[]>([]);
  const [loadingTodos, setLoadingTodos] = useState<number[]>([]);
  const [queryTodo, setQueryTodo] = useState('');
  const [filterTodo, setFilterTodo] = useState<FilterForTodo>(FilterForTodo.ALL);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [isInputDisabled, setIsInputDisabled] = useState(false);

  const [isVisibleError, setIsVisibleError] = useState(false);
  const [isValidData, setIsValidData] = useState({
    isAddError: false,
    isDeleteError: false,
    isUpdateError: false,
    isLoadError: false,
    isTitleEmpty: false,
  });

  useEffect(() => {
    if (windowRef.current) {
      windowRef.current.focus();
    }

    getTodos(USER_ID)
      .then(fetchedTodos => {
        setTodos(fetchedTodos as Todo[]);

        setCompletedTodosId(
          getCompletedTodosIds(fetchedTodos),
        );
      })
      .catch(() => {
        setIsValidData((prevData) => (
          updateIsValidData(prevData, 'isLoadError', true)));

        setIsVisibleError(true);
      });
  }, [tempTodo]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleOnSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!queryTodo.trim()) {
      setIsValidData((prevData) => (
        updateIsValidData(prevData, 'isTitleEmpty', true)));

      setQueryTodo('');
      setIsVisibleError(true);

      return;
    }

    const newTodo = {
      id: 0,
      title: queryTodo,
      completed: false,
      userId: USER_ID,
    };

    setTempTodo(newTodo);
    setIsInputDisabled(true);

    try {
      await setTodoToServer('/todos', { ...newTodo });
    } catch (error) {
      setIsValidData((prevData) => (
        updateIsValidData(prevData, 'isAddError', true)));

      setIsVisibleError(true);
    } finally {
      setIsInputDisabled(false);
      setTempTodo(null);
      setQueryTodo('');
    }
  };

  const handleOnQuery = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setQueryTodo(event.target.value);
  };

  const getTodoId = (id: number) => {
    setCompletedTodosId((prevIds) => {
      return [...prevIds, id];
    });

    setLoadingTodos((prevIds) => {
      return [...prevIds, id];
    });
  };

  const removesTodo = async (todosIds: number[]) => {
    try {
      await Promise.all(todosIds.map(id => removeTodo(id)));

      const updatedTodos = todos.filter(todo => !todosIds.includes(todo.id));

      setTodos(updatedTodos);
    } catch (error) {
      setIsValidData((prevData) => (
        updateIsValidData(prevData, 'isDeleteError', true)));

      setIsVisibleError(true);
    } finally {
      setLoadingTodos([]);
    }
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          <button
            type="button"
            className="todoapp__toggle-all active"
          />

          <form
            onSubmit={handleOnSubmit}
          >
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={queryTodo}
              onChange={handleOnQuery}
              disabled={isInputDisabled}
              ref={windowRef}
            />
          </form>
        </header>

        <TodosList
          todos={visibleTodos(todos, filterTodo)}
          tempTodo={tempTodo}
          getTodoId={getTodoId}
          removesTodo={removesTodo}
          loadingTodos={loadingTodos}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${todos.length} items left`}
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: filterTodo === FilterForTodo.ALL,
                })}
                defaultValue="all"
                onClick={() => setFilterTodo(FilterForTodo.ALL)}
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: filterTodo === FilterForTodo.ACTIVE,
                })}
                onClick={() => setFilterTodo(FilterForTodo.ACTIVE)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: filterTodo === FilterForTodo.COMPLETED,
                })}
                onClick={() => setFilterTodo(FilterForTodo.COMPLETED)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!completedTodosId.length}
              onClick={() => {
                removesTodo(completedTodosId);
                setLoadingTodos(completedTodosId);
                setCompletedTodosId([]);
              }}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorInfo
        isVisibleError={isVisibleError}
        isValidData={isValidData}
        setIsVisibleError={setIsVisibleError}
      />
    </div>
  );
};
