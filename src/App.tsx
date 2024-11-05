import React, {
  useEffect,
  useState,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { Todo } from './types/Todo';
import { getTodos, loadTodos, deleteTodo, USER_ID } from './api/todos';
import classNames from 'classnames';
import { TodoList } from './components/TodoList';
import { TodoItem } from './components/TodoItem';
import { Footer } from './components/Footer';
import { Status } from './separate/Status';

export const App: React.FC = () => {
  const [title, setTitle] = useState('');
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMassage, setErrorMassage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingTodoId, setLoadingTodoId] = useState<number[]>([]);
  const [filter, setFilter] = useState<Status>(Status.all);
  const [inputDisabled, setInputDisabled] = useState<boolean>(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const active = todos.filter((todo: Todo) => !todo.completed);
  const todoCompleted = todos.filter(todo => todo.completed);

  useEffect(() => {
    setLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMassage('Unable to load todos'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setErrorMassage(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMassage]);

  useEffect(() => {
    if (inputRef.current) {
      return inputRef.current.focus();
    }
  }, [inputDisabled]);

  const handleStatusChange = (newFilter: Status) => {
    setFilter(newFilter);
  };

  const handleToggleTodo = (id: number) => {
    const toggleTodo = todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo,
    );

    setTodos(toggleTodo);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);

    setErrorMassage('');
  };

  const handleNewTodo = (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMassage('Title should not be empty');

      return;
    }

    setInputDisabled(true);
    setErrorMassage('');

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    });

    if (tempTodo) {
      setTodos(prevTodos => [...prevTodos, tempTodo]);
    }

    return loadTodos({
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    })
      .then(newTodo => {
        setTodos(prevTodos =>
          prevTodos.filter(todo => todo.id !== tempTodo?.id),
        );
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTitle('');
        setTempTodo(null);
      })
      .catch(error => {
        setTodos(todos);
        setTempTodo(null);
        setErrorMassage('Unable to add a todo');
        throw error;
      })
      .finally(() => setInputDisabled(false));
  };

  const handleDeleteTodo = (todoId: number) => {
    setInputDisabled(true);
    setLoadingTodoId(prevId => [...prevId, todoId]);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(error => {
        setErrorMassage('Unable to delete a todo');
        throw error;
      })
      .finally(() => {
        setInputDisabled(false);
        setLoadingTodoId([]);
      });
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    await completedTodos.forEach(id => handleDeleteTodo(id));
  };

  const hanldeCloseErrorMessage = () => {
    setErrorMassage('');
  };

  const filterTodos = useCallback(
    (currentTodos: Todo[], currentStatus: Status) => {
      switch (currentStatus) {
        case Status.active:
          return currentTodos.filter((todo: Todo) => !todo.completed);

        case Status.completed:
          return currentTodos.filter((todo: Todo) => todo.completed);

        case Status.all:
        default:
          return currentTodos;
      }
    },
    [],
  );


  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filter);
  }, [filterTodos, todos, filter]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />
          <form onSubmit={handleNewTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={title}
              onChange={handleTitleChange}
              disabled={inputDisabled}
              ref={inputRef}
            />
          </form>
        </header>
        {!loading && (
          <>
            <TodoList
              todos={filteredTodos}
              handleToggleTodo={handleToggleTodo}
              onDeleteTodo={handleDeleteTodo}
              loadingTodoId={loadingTodoId}
            />
            {tempTodo && (
              <TodoItem todo={tempTodo} handleToggleTodo={handleToggleTodo} />
            )}
          </>
        )}
        {!!todos.length && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {active.length} items left
            </span>

            <Footer filter={filter} statusChange={handleStatusChange} />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={todoCompleted.length === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          {
            hidden: !errorMassage,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={hanldeCloseErrorMessage}
        />
        {errorMassage}
      </div>
    </div>
  );
};
