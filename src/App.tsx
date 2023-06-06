/* eslint-disable prefer-const */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from 'react';
import classNames from 'classnames';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { UserWarning } from './UserWarning';

import { getTodos, createTodo, deleteTodo } from './api/todos';

import { Todo } from './types/Todo';
import { TodoItem } from './components/TodoItem';

const USER_ID = 10613;

enum FilterStatus {
  all = 'all',
  active = 'active',
  completed = 'completed',
}

enum ErrorType {
  onLoad,
  onAdd,
  onDelete,
  onUpdate,
  missingTitle,
}

type SetError = {
  type: 'set_error';
  value: ErrorType;
};

type RemoveError = {
  type: 'remove_error';
};

const reducer = (state: {
  isError: boolean,
  errorType: ErrorType | null,
}, action: SetError | RemoveError) => {
  switch (action.type) {
    case 'set_error':
      return {
        errorType: action.value,
        isError: true,
      };

    case 'remove_error':
      return {
        ...state,
        isError: false,
      };

    default:
      return state;
  }
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [processedTodoIds, setProcessedTodoIds] = useState<number[]>([]);
  const [filterStatus, setFilterStatus] = useState(FilterStatus.all);
  const [todoTitle, setTodoTitle] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, dispatch] = useReducer(reducer, {
    isError: false,
    errorType: null,
  });

  const showError = useCallback(
    (value: ErrorType) => {
      dispatch({ type: 'set_error', value });

      setTimeout(() => {
        dispatch({ type: 'remove_error' });
      }, 3000);
    },
    [],
  );

  const loadTodos = async () => {
    try {
      const todosFromServer = await getTodos(USER_ID);

      setTodos(todosFromServer);
    } catch {
      showError(ErrorType.onLoad);
    }
  };

  useEffect(() => {
    loadTodos();
  }, []);

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      switch (filterStatus) {
        case FilterStatus.active:
          return !todo.completed;

        case FilterStatus.completed:
          return todo.completed;

        case FilterStatus.all:
        default:
          return todo;
      }
    });
  }, [todos, filterStatus]);

  const handleFormSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!todoTitle.trim()) {
      showError(ErrorType.missingTitle);

      return;
    }

    try {
      dispatch({ type: 'remove_error' }); // hide error before any next request

      setIsCreating(true);

      setTempTodo({
        id: 0,
        userId: USER_ID,
        title: todoTitle,
        completed: false,
      });

      const todo = await createTodo(USER_ID, todoTitle);

      setTodos([
        ...todos,
        todo,
      ]);

      setTodoTitle('');

      setTempTodo(null);

      // eslint-disable-next-line no-console
      console.log(todo);
    } catch {
      showError(ErrorType.onAdd);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setProcessedTodoIds([
        ...processedTodoIds,
        todoId,
      ]);

      dispatch({ type: 'remove_error' });

      await deleteTodo(todoId);

      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      showError(ErrorType.onDelete);
    } finally {
      setProcessedTodoIds([]);
    }
  };

  const handleClearCompleted = async () => {
    try {
      const completedTodoIds = todos.filter(todo => todo.completed)
        .map(todo => todo.id);

      setProcessedTodoIds(completedTodoIds);

      await Promise.all(completedTodoIds.map(todoId => deleteTodo(todoId)));

      setTodos(todos.filter(todo => !todo.completed));
    } catch {
      showError(ErrorType.onDelete);
    } finally {
      setProcessedTodoIds([]);
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todos.length !== 0 && (
            <button
              type="button"
              className={classNames(
                'todoapp__toggle-all',
                { active: todos.every(todo => todo.completed) },
              )}
            />
          )}

          <form onSubmit={handleFormSubmit}>
            <input
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={todoTitle}
              onChange={(event) => setTodoTitle(event.target.value)}
              disabled={isCreating}
            />
          </form>
        </header>

        <section className="todoapp__main">
          <TransitionGroup>
            {visibleTodos.map(todo => (
              <CSSTransition
                key={todo.id}
                timeout={300}
                classNames="item"
              >
                <TodoItem
                  todo={todo}
                  onDelete={handleDeleteTodo}
                  isProcessed={processedTodoIds.includes(todo.id)}
                />
              </CSSTransition>
            ))}

            {tempTodo !== null && (
              <CSSTransition
                key={0}
                timeout={300}
                classNames="temp-item"
              >
                <TodoItem
                  todo={tempTodo}
                  isProcessed
                />
              </CSSTransition>
            )}
          </TransitionGroup>

        </section>

        {todos.length !== 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${todos.filter(todo => !todo.completed).length} items left`}
            </span>

            <nav className="filter">
              <a
                href="#/"
                className={classNames(
                  'filter__link',
                  { selected: filterStatus === 'all' },
                )}
                onClick={() => setFilterStatus(FilterStatus.all)}
              >
                All
              </a>

              <a
                href="#/active"
                className={classNames(
                  'filter__link',
                  { selected: filterStatus === 'active' },
                )}
                onClick={() => setFilterStatus(FilterStatus.active)}
              >
                Active
              </a>

              <a
                href="#/completed"
                className={classNames(
                  'filter__link',
                  { selected: filterStatus === 'completed' },
                )}
                onClick={() => setFilterStatus(FilterStatus.completed)}
              >
                Completed
              </a>
            </nav>

            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={todos.every(todo => !todo.completed)}
              onClick={() => handleClearCompleted()}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <div className={classNames(
        'notification',
        'is-danger',
        'is-light',
        'has-text-weight-normal',
        { hidden: !error.isError },
      )}
      >
        <button
          type="button"
          className="delete"
          onClick={() => dispatch({ type: 'remove_error' })}
        />

        {error.errorType === ErrorType.onLoad && 'Unable to load the todos'}
        {error.errorType === ErrorType.onAdd && 'Unable to add a todo'}
        {error.errorType === ErrorType.onDelete && 'Unable to delete a todo'}
        {error.errorType === ErrorType.onUpdate && 'Unable to update a todo'}
        {error.errorType === ErrorType.missingTitle && (
          "Title can't be empty"
        )}
      </div>
    </div>
  );
};
