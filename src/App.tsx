/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { deleteTodos, getTodos, postTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { TodoForm } from './components/TodoForm/TodoForm';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { FilterStatus } from './types/FilterStatus';
import { TodoList } from './components/TodoList/TodoList';
import { ErrorTypes } from './types/ErrorTypes';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);
  const [errorMessage, setErrorMessage] = useState<string>(ErrorTypes.noError);
  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);

  const titleInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setErrorMessage(ErrorTypes.noError);
    getTodos()
      .then(todo => {
        setTodos(todo);
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.emptyTodos);
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage(ErrorTypes.noError);
    }, 3000);

    return () => {
      clearTimeout(timerId);
    };
  }, [errorMessage]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const isAllCompleted =
    todos.length > 0 && todos.every(todo => todo.completed);

  const hasCompleted = todos.some(todo => todo.completed);

  const activeTodosCount = todos.filter(todo => !todo.completed).length;

  const visibleTodos = todos.filter(todo => {
    if (filter === FilterStatus.All) {
      return true;
    }

    if (filter === FilterStatus.Active) {
      return todo.completed === false;
    }

    if (filter === FilterStatus.Completed) {
      return todo.completed === true;
    }
  });

  const filters = [
    { value: FilterStatus.All, label: 'All', href: '#/', cy: 'FilterLinkAll' },
    {
      value: FilterStatus.Active,
      label: 'Active',
      href: '#/active',
      cy: 'FilterLinkActive',
    },
    {
      value: FilterStatus.Completed,
      label: 'Completed',
      href: '#/completed',
      cy: 'FilterLinkCompleted',
    },
  ];

  const handleAddTodo = () => {
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorTypes.emptyTitle);

      return;
    }

    const temporaryTodo: Todo = {
      id: 0,
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    };

    setErrorMessage(ErrorTypes.noError);
    setIsLoading(true);
    setTempTodo(temporaryTodo);

    postTodos({
      userId: USER_ID,
      title: trimmedTitle,
      completed: false,
    })
      .then(createdTodo => {
        setTodos(prev => [...prev, createdTodo]);
        setTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.errorAddTodo);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  function deleteTodo(todoId: number) {
    setErrorMessage('');
    setDeletingIds(prev => [...prev, todoId]);

    deleteTodos(todoId)
      .then(() => {
        setTodos(prev => prev.filter(todo => todo.id !== todoId));
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.errorDeleteTodo);
      })
      .finally(() => {
        setDeletingIds(prev => prev.filter(id => id !== todoId));
        titleInputRef.current?.focus();
      });
  }

  async function deleteCompletedTodo() {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    setErrorMessage('');
    setDeletingIds(prev => [...prev, ...completedIds]);

    const results = await Promise.allSettled(
      completedIds.map(id => deleteTodos(id)),
    );

    const deletedIds = completedIds.filter(
      (_, index) => results[index].status === 'fulfilled',
    );

    setTodos(current => current.filter(todo => !deletedIds.includes(todo.id)));

    if (deletedIds.length < completedIds.length) {
      setErrorMessage(ErrorTypes.errorDeleteTodo);
    }

    setDeletingIds(prev => prev.filter(id => !completedIds.includes(id)));
    titleInputRef.current?.focus();
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={`todoapp__toggle-all ${isAllCompleted ? 'active' : ''}`}
            data-cy="ToggleAllButton"
          />

          <TodoForm
            title={title}
            setTitle={setTitle}
            onSubmit={handleAddTodo}
            isLoading={isLoading}
            inputRef={titleInputRef}
          />
        </header>

        <TodoList
          visibleTodos={visibleTodos}
          tempTodo={tempTodo}
          deletingIds={deletingIds}
          deleteTodo={deleteTodo}
        />

        {todos.length > 0 && (
          <Footer
            activeTodosCount={activeTodosCount}
            filters={filters}
            filter={filter}
            setFilter={setFilter}
            hasCompleted={hasCompleted}
            deleteCompletedTodo={deleteCompletedTodo}
          />
        )}

        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      </div>
    </div>
  );
};
