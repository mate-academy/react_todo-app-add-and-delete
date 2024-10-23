/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classNames';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './components/TodoList/TodoList';

enum ErrorMessage {
  load = 'Unable to load todos',
  title = 'Title should not be empty',
  add = 'Unable to add a todo',
  delete = 'Unable to delete a todo',
  update = 'Unable to update a todo',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const [status, setStatus] = useState('all');
  const [todoIdToDelete, setTodoIdToDelete] = useState<number[]>([]);
  const [todoTitle, setTodoTitle] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const titleField = useRef<HTMLInputElement>(null);

  const hasError = useMemo(() => !Boolean(errorMessage), [errorMessage]);
  const onAutoCloseNotification = useCallback(() => {
    setTimeout(() => {
      setErrorMessage(null);
    }, 3000);
  }, []);
  const onCloseNotification = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      setErrorMessage(null);
    },
    [],
  );
  const onSetStatus = useCallback((event: React.MouseEvent) => {
    const a = event.target as HTMLAnchorElement;
    const statusValue = a.getAttribute('href')?.replace('#/', '') || 'all';

    setStatus(statusValue);
  }, []);
  const isActiveButton = useCallback(
    (value: string) => value === status,
    [status],
  );

  const visibleTodos = useMemo(() => {
    switch (status) {
      case 'all':
        return todos;
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  }, [status, todos]);

  const todosCounter = useMemo(() => {
    const notCompletedTodos = todos.filter(todo => !todo.completed).length;
    const message =
      notCompletedTodos === 1
        ? `${notCompletedTodos} item left`
        : `${notCompletedTodos} items left`;

    return message;
  }, [todos]);
  const completedTodos = useMemo(() => {
    const completed = todos.filter(todo => todo.completed).length;

    return completed;
  }, [todos]);

  const handleNewTodoForm = (event: React.FormEvent) => {
    event.preventDefault();

    if (isProcessing) {
      return;
    }

    if (!todoTitle.trim()) {
      setErrorMessage(ErrorMessage.title);
      setTodoTitle('');
      onAutoCloseNotification();

      return;
    }

    setTempTodo({ title: todoTitle, userId: USER_ID, id: 0, completed: false });

    setIsProcessing(true);

    addTodo(todoTitle.trim())
      .then(newTodo => {
        setTodos(prev => [...prev, newTodo as Todo]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.add);
        onAutoCloseNotification();
      })
      .finally(() => {
        setIsProcessing(false);
        setTempTodo(null);
      });
  };

  const handleClearCompleted = async () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);
    const toDeleteTodo: number[] = [];

    setTodoIdToDelete(completedIds);

    try {
      await Promise.all(
        completedIds.map(async id => {
          try {
            await deleteTodo(id);
            toDeleteTodo.push(id);
          } catch (error) {
            setErrorMessage(ErrorMessage.delete);
            onAutoCloseNotification();
          }
        }),
      );
      setTodos(prevTodos =>
        prevTodos.filter(todo => !toDeleteTodo.includes(todo.id)),
      );
    } catch (innerError) {
      setErrorMessage(ErrorMessage.delete);
      onAutoCloseNotification();
    } finally {
      setTodoIdToDelete([]);
    }
  };

  const handleDeleteTodo = (todoId: number) => {
    setTodoIdToDelete([todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
        setTodoIdToDelete([]);
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.delete);
        onAutoCloseNotification();
      })
      .finally(() => {
        setTodoIdToDelete([]);
      });
  };

  useEffect(() => {
    const currentField = titleField.current;

    if (currentField !== null) {
      currentField.focus();
    }
  }, [titleField, todos, tempTodo]);

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.load);
        onAutoCloseNotification();
      });
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

          {/* Add a todo on form submit */}
          <form onSubmit={handleNewTodoForm}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={event => setTodoTitle(event.target.value)}
              value={todoTitle}
              ref={titleField}
              disabled={isProcessing}
            />
          </form>
        </header>

        <TodoList
          todos={visibleTodos}
          todoIdToDelete={todoIdToDelete}
          onDelete={handleDeleteTodo}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {todosCounter}
            </span>

            {/* Active link should have the 'selected' class */}
            <nav className="filter" data-cy="Filter" onClick={onSetStatus}>
              <a
                href="#/"
                className={cn('filter__link', {
                  selected: isActiveButton('all'),
                })}
                data-cy="FilterLinkAll"
              >
                All
              </a>

              <a
                href="#/active"
                className={cn('filter__link', {
                  selected: isActiveButton('active'),
                })}
                data-cy="FilterLinkActive"
              >
                Active
              </a>

              <a
                href="#/completed"
                className={cn('filter__link', {
                  selected: isActiveButton('completed'),
                })}
                data-cy="FilterLinkCompleted"
              >
                Completed
              </a>
            </nav>

            {/* this button should be disabled if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={completedTodos === 0}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: hasError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={onCloseNotification}
        />
        {errorMessage}
      </div>
    </div>
  );
};
