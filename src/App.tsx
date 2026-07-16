import React, { useEffect, useRef } from 'react';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { UserWarning } from './UserWarning';
import { USER_ID, getTodos, addTodo, deleteTodo } from './api/todos';
import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = React.useState<Todo[]>([]);
  const [error, setError] = React.useState('');
  const [filter, setFilter] = React.useState<Filter>(Filter.All);
  const [inputValue, setInputValue] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [tempTodo, setTempTodo] = React.useState<Todo | null>(null);
  const [loadingTodoIds, setLoadingTodoIds] = React.useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);
  const errorTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showError(message: string) {
    setError(message);

    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    errorTimeoutRef.current = setTimeout(() => {
      setError('');
    }, 3000);
  }

  function hideError() {
    if (errorTimeoutRef.current) {
      clearTimeout(errorTimeoutRef.current);
    }

    setError('');
  }

  useEffect(() => {
    if (!isSubmitting) {
      inputRef.current?.focus();
    }
  }, [isSubmitting, loadingTodoIds]);

  useEffect(() => {
    getTodos()
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => {
        showError('Unable to load todos');
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const visibleTodos = todos.filter(todo => {
    if (filter === Filter.Active) {
      return !todo.completed;
    }

    if (filter === Filter.Completed) {
      return todo.completed;
    }

    return true;
  });

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    hideError();

    const trimmedTitle = inputValue.trim();

    setInputValue(trimmedTitle);
    if (!trimmedTitle) {
      showError('Title should not be empty');

      return;
    }

    setIsSubmitting(true);
    setTempTodo({
      id: 0,
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    });

    addTodo({ title: trimmedTitle, completed: false, userId: USER_ID })
      .then(todo => {
        setTodos([...todos, todo]);
        setInputValue('');
      })
      .catch(() => {
        showError('Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsSubmitting(false);
      });
  };

  function handleDelete(id: number) {
    setLoadingTodoIds(prev => [...prev, id]);

    deleteTodo(id)
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
      })
      .catch(() => {
        showError('Unable to delete a todo');
      })
      .finally(() => {
        setLoadingTodoIds(prev => prev.filter(todoId => todoId !== id));
      });
  }

  const completedTodos = todos.filter(todo => todo.completed);

  function handleClearCompleted() {
    const completedIds = completedTodos.map(todo => todo.id);

    setLoadingTodoIds(prev => [...prev, ...completedIds]);

    Promise.allSettled(completedTodos.map(todo => deleteTodo(todo.id)))
      .then(results => {
        const deletedIds = completedTodos
          .filter((_todo, index) => results[index].status === 'fulfilled')
          .map(todo => todo.id);

        setTodos(prevTodos =>
          prevTodos.filter(todo => !deletedIds.includes(todo.id)),
        );

        if (results.some(result => result.status === 'rejected')) {
          showError('Unable to delete a todo');
        }
      })
      .finally(() => {
        setLoadingTodoIds(prev =>
          prev.filter(id => !completedIds.includes(id)),
        );
      });
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          inputRef={inputRef}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />

        {todos.length > 0 && (
          <>
            <TodoList
              todos={visibleTodos}
              tempTodo={tempTodo}
              loadingTodoIds={loadingTodoIds}
              onDelete={handleDelete}
            />

            <TodoFooter
              todos={todos}
              filter={filter}
              onFilterChange={setFilter}
              onClearCompleted={handleClearCompleted}
            />
          </>
        )}
      </div>

      <ErrorNotification error={error} onClose={hideError} />
    </div>
  );
};
