/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
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

export const App: React.FC = () => {
  const [todosFromServer, setTodosFromServer] = useState<TodoType[]>([]);
  const [filterStatus, setFilterStatus] = useState<Filter>(Filter.All);
  const [inputValue, setInputValue] = useState('');
  const [tempTodo, setTempTodo] = useState<null | string>(null);
  const [lockInput, setLockInput] = useState(false);
  const [deleteAll, setDeleteAll] = useState(false);
  const [errorMessage, setErrorMessage] = useState<null | string>(null);

  const inputElement = useRef<HTMLInputElement>(null);

  const loadTodos = async () => {
    try {
      const todos = await getTodos();

      setTodosFromServer(todos);
    } catch {
      setErrorMessage('Unable to load todos');
    }
  };

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }

    loadTodos();
  }, []);

  useEffect(() => {
    if (inputElement.current) {
      inputElement.current.focus();
    }
  }, [lockInput]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setInputValue(value.trim());
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
    setErrorMessage(null);

    if (!inputValue.length) {
      setErrorMessage('Title should not be empty');

      return;
    }

    setLockInput(true);
    setTempTodo(inputValue);
    try {
      const newPost = await postTodo(inputValue);

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

    try {
      const deletePromises: Promise<void>[] = [];

      todosFromServer.forEach(todo => {
        if (todo.completed) {
          deletePromises.push(handleDeleteTodo(todo.id));
        }
      });

      await Promise.all(deletePromises);

      setTodosFromServer(currentTodos =>
        currentTodos.filter(todo => !todo.completed),
      );
    } catch {
      setErrorMessage('Unable to delete a todo');
    } finally {
      setDeleteAll(false);
    }
  };

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

  const activeTodos = useMemo(
    () => todosFromServer.filter(todo => !todo.completed),
    [todosFromServer],
  );
  const completedTodos = useMemo(
    () => todosFromServer.filter(todo => todo.completed),
    [todosFromServer],
  );

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

          {/* Add a todo on form submit */}
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
          {preparedTodos.map(todo => (
            <Todo
              key={todo.id}
              todo={todo}
              deleteTodo={handleDeleteTodo}
              deleteAll={deleteAll}
            />
          ))}
          {tempTodo && <TempTodo value={tempTodo} />}
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

            {/* this button should be disabled if there are no completed todos */}
            {!!completedTodos.length && (
              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleDeleteAll}
              >
                Clear completed
              </button>
            )}
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
