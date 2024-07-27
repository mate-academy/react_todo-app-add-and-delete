import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addNewTodo, deleteTodo } from './api/todos';
import { Todo } from './types/Todo';
import { TodoStatus } from './types/SortTypes';
import { ErrorType } from './types/Errors';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { SortButtons } from './components/SortButtons';
import classNames from 'classnames';

const emptyTodo: Omit<Todo, 'id'> = {
  completed: false,
  userId: USER_ID,
  title: '',
};

const TodoStatusRoutes: Record<TodoStatus, string> = {
  [TodoStatus.All]: '/',
  [TodoStatus.Active]: '/active',
  [TodoStatus.Completed]: '/completed',
};

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedTodoStatus, setSelectedTodoStatus] = useState<TodoStatus>(
    TodoStatus.All,
  );
  const [errorMessage, setErrorMessage] = useState<ErrorType | null>(null);
  const [emptyTitle, setEmptyTitle] = useState(false);
  const [tempTodo, setTempTodo] = useState<Omit<Todo, 'id'> | null>(null);

  const isDisabled = todos.filter(t => t.completed).length === 0;

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorType.LOAD_TODOS));
  }, []);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  const filteredTodos = useMemo(() => {
    switch (selectedTodoStatus) {
      case TodoStatus.Active:
        return todos.filter(todo => !todo.completed);

      case TodoStatus.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return todos;
    }
  }, [selectedTodoStatus, todos]);

  const closeErrorHandler = () => {
    setErrorMessage(null);
  };

  const handleStatusChange = (status: TodoStatus) => {
    setSelectedTodoStatus(status);
  };

  const addTodo = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      if (title.trim() === '') {
        setEmptyTitle(true);
        setErrorMessage(null);

        return;
      }

      const trimmedTitle = title.trim();

      setIsLoading(true);
      setErrorMessage(null);
      setTempTodo({ ...emptyTodo, title: trimmedTitle });

      addNewTodo({
        ...emptyTodo,
        title: trimmedTitle,
      })
        .then(todo => {
          setTodos(currentTodos => [...currentTodos, todo]);
          setTitle(''); // Clear the title
          setTempTodo(null);
        })
        .catch(() => {
          setErrorMessage(ErrorType.ADD_TODO);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [title],
  );

  const changeTodoHandler = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setErrorMessage(null);
      setEmptyTitle(false);
      setTitle(e.target.value); // Update title state
    },
    [],
  );

  const handleBlur = () => {
    setTitle(title.trim()); // Trim title on blur
  };

  const deleteTodoHandler = useCallback((todoId: number) => {
    setIsLoading(true);
    setErrorMessage(null);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorType.DELETE_TODO);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  const clearCompletedTodos = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id))).then(
      results => {
        const successfulDeletions = results
          .filter(result => result.status === 'fulfilled')
          .map((_, index) => completedTodos[index].id);

        setTodos(currentTodos =>
          currentTodos.filter(todo => !successfulDeletions.includes(todo.id)),
        );

        if (results.some(result => result.status === 'rejected')) {
          setErrorMessage(ErrorType.CLEAR_COMPLETED_TODOS);
        }
      },
    );
  };

  const filteringTodosByActiveStatus = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          title={title} // Pass title instead of newTodo
          onChange={changeTodoHandler}
          onBlur={handleBlur}
          isLoading={isLoading}
        />
        <TodoList
          preparedTodos={filteredTodos}
          isLoading={isLoading}
          onDelete={deleteTodoHandler}
        />

        {tempTodo && (
          <div className="todoitem">
            <p>{tempTodo.title}</p>
            <div className="loader"></div>
          </div>
        )}

        <SortButtons
          todos={todos}
          selectedStatus={selectedTodoStatus}
          onStatusChange={handleStatusChange}
          filteringTodosByActiveStatus={filteringTodosByActiveStatus}
          TodoStatusRoutes={TodoStatusRoutes}
          isDisabled={isDisabled}
        />

        <button
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompletedTodos}
          disabled={todos.every(todo => !todo.completed)}
        >
          Clear completed
        </button>
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage && !emptyTitle },
        )}
      >
        {emptyTitle && <p>Title should not be empty</p>}
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closeErrorHandler}
        />
        {errorMessage}
      </div>
    </div>
  );
};
