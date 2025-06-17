/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorType, FilterType } from './types/ErrorType';
import cn from 'classnames';
import { getFilteredTodos } from './utils/getFilteredTodos';
import { TodoItem } from './components/TodoItem';
import { StatusFilter } from './components/StatusFilter';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorType>(
    ErrorType.DEFAULT,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<FilterType>(FilterType.All);
  const [processingTodoIds, setProcessingTodoIds] = useState<Todo['id'][]>([]);
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const handleAddTodoToProcessing = (todoId: Todo['id']) => {
    setProcessingTodoIds(current => [...current, todoId]);
  };

  const handleRemoveTodoToProcessing = (todoId: Todo['id']) => {
    setProcessingTodoIds(current => current.filter(id => id !== todoId));
  };

  const handleToggleStatus = (todoId: number) => {
    setTodos(currentTodos =>
      currentTodos.map(todo =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
  };

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorType.LOAD_TODOS))
      .finally(() => setIsLoading(false));
  }, []);

  const handleDeleteTodo = useCallback((todoId: Todo['id']) => {
    handleAddTodoToProcessing(todoId);

    return deleteTodo(todoId)
      .then(() => {
        setTodos(current => current.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorType.DELETE_TODO);
      })
      .finally(() => {
        handleRemoveTodoToProcessing(todoId);
      });
  }, []);

  const inputRef = useRef<HTMLInputElement>(null);

  function addTodo(newTodo: Omit<Todo, 'id'>) {
    const temp = {
      ...newTodo,
      id: 0,
    };

    setTempTodo(temp);
    setIsAdding(true);
    handleAddTodoToProcessing(0);

    createTodo(newTodo)
      .then(todoFromServer => {
        setTodos(currentTodos => [...currentTodos, todoFromServer]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorType.ADD_TODO);
      })
      .finally(() => {
        setIsAdding(false);
        setTempTodo(null);
        handleRemoveTodoToProcessing(0);
      });
  }

  useEffect(() => {
    if (processingTodoIds) {
      inputRef.current?.focus();
    }
  }, [processingTodoIds]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) {
      setErrorMessage(ErrorType.EMPTY_TITLE);

      return;
    }

    const newTodo = {
      userId: USER_ID,
      title: title.trim(),
      completed: false,
    };

    addTodo(newTodo);
  };

  const handleClearCompleted = useCallback(async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const results = await Promise.allSettled(
      completedTodos.map(todo => handleDeleteTodo(todo.id)),
    );

    const hasError = results.some(result => result.status === 'rejected');

    if (hasError) {
      setErrorMessage(ErrorType.DELETE_TODO);
    }

    inputRef.current?.focus();
  }, [todos, handleDeleteTodo]);

  const filteredTodos = useMemo(() => {
    return getFilteredTodos(todos, status);
  }, [todos, status]);
  const activeTodosCounter = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

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
            className={cn('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />

          {/* Add a todo on form submit */}
          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={title}
              onChange={event => setTitle(event.target.value)}
              ref={inputRef}
              disabled={isAdding}
            />
          </form>
        </header>

        {!isLoading && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {/* This is a completed todo */}

              {filteredTodos.map(todo => (
                <TodoItem
                  key={todo.id}
                  todo={todo}
                  onDeleteTodo={handleDeleteTodo}
                  isLoading={processingTodoIds.includes(todo.id)}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
              {tempTodo && (
                <TodoItem
                  todo={tempTodo}
                  onDeleteTodo={() => {}}
                  isLoading={true}
                  onToggleStatus={() => {}}
                />
              )}
            </section>

            {/* Hide the footer if there are no todos */}
            {todos.length > 0 && (
              <footer className="todoapp__footer" data-cy="Footer">
                <span className="todo-count" data-cy="TodosCounter">
                  {activeTodosCounter} items left
                </span>

                {/* Active link should have the 'selected' class */}
                <StatusFilter status={status} onStatusChange={setStatus} />
                {/* this button should be disabled if there are no completed todos */}
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  data-cy="ClearCompletedButton"
                  disabled={!todos.some(todo => todo.completed)}
                  onClick={handleClearCompleted}
                >
                  Clear completed
                </button>
              </footer>
            )}
          </>
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}

      <ErrorNotification
        message={errorMessage}
        onClear={() => setErrorMessage(ErrorType.DEFAULT)}
      />
    </div>
  );
};
