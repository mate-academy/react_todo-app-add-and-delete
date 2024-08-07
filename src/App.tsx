import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';
import { getTodos, postTodo, deleteTodo } from './api/todos';
import { Filter } from './types/Filter';
import { Todo as TodoType } from './types/Todo';
import { Todo } from './components/Todo';
import { TodoFilter } from './components/TodoFilter';
import { ErrorMessage } from './components/ErrorMessage';
import { TempTodo } from './components/TempTodo';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<TodoType[]>([]);
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<null | string>(null);
  const [lockInput, setLockInput] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const inputElement = useRef<HTMLInputElement>(null);

  const completedTodos = useMemo(
    () => todosFromServer.filter(todo => todo.completed),
    [todosFromServer],
  );

  const activeTodos = useMemo(
    () => todosFromServer.filter(todo => !todo.completed),
    [todosFromServer],
  );

  const preparedTodos = useMemo(
    () =>
      todosFromServer.filter(todo => {
        const { completed } = todo;

        switch (filterStatus) {
          case Filter.Active:
            return !completed;

          case Filter.Completed:
            return completed;

          default:
            return todo;
        }
      }),
    [todosFromServer, filterStatus],
  );

  const loadTodos = async () => {
    try {
      const todos = await getTodos();

      setTodosFromServer(todos);
    } catch {
      setErrorMessage('Unable to load todos');
    }
  };

  useEffect(() => {
    inputElement.current?.focus();

    loadTodos();
  }, []);

  useEffect(() => {
    inputElement.current?.focus();
  }, [lockInput]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value);
  };

  const handleDeleteTodo = useCallback(
    async (id: number) => {
      setErrorMessage(null);
      setLockInput(true);
      try {
        await deleteTodo(id);

        setTodosFromServer(
          [...todosFromServer].filter(todoItem => todoItem.id !== id),
        );
      } catch {
        setErrorMessage('Unable to delete a todo');
      } finally {
        setLockInput(false);
      }
    },
    [todosFromServer],
  );

  const handlePostTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const preparedInputValue = inputValue.trim();

    setErrorMessage(null);

    if (!preparedInputValue.length) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setLockInput(true);
    setTempTodo(preparedInputValue);

    try {
      const newPost = await postTodo(preparedInputValue);

      setTodosFromServer(currentTodos => [...currentTodos, newPost]);

      setInputValue('');
    } catch {
      setErrorMessage('Unable to add a todo');
    } finally {
      setLockInput(false);
      setTempTodo(null);
    }
  };

  const handleDeleteAll = async () => {
    setDeleteAll(true);
    setErrorMessage(null);

    let updatedTodos = [...todosFromServer];

    await Promise.allSettled(
      todosFromServer.map(async ({ completed, id }) => {
        // const { completed, id } = todo;

        if (completed) {
          try {
            await deleteTodo(id);
            updatedTodos = updatedTodos.filter(item => item.id !== id);
          } catch {
            setErrorMessage('Unable to delete a todo');
          }
        }
      }),
    );

    setTodosFromServer(updatedTodos);
    setDeleteAll(false);
    inputElement.current?.focus();
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}
          <button
            type="button"
            className={cn('todoapp__toggle-all', {
              active: completedTodos.length === todosFromServer.length,
            })}
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handlePostTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={lockInput}
              value={inputValue}
              onChange={handleInputChange}
              ref={inputElement}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {preparedTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <Todo
                  todo={todo}
                  deleteTodo={handleDeleteTodo}
                  deleteAll={deleteAll}
                />
              </CSSTransition>
            ))}
            {tempTodo && (
              <CSSTransition key={0} timeout={300} classNames="temp-item">
                <TempTodo value={tempTodo} />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {!!todosFromServer.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeTodos.length} items left`}
            </span>

            <TodoFilter
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />

            <button
              disabled={!completedTodos.length}
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleDeleteAll}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorMessage
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
