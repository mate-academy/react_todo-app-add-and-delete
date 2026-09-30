import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import { Filter } from './types/Filter';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';

function getVisibleTodos(todos: Todo[], selectedFilter: Filter) {
  if (selectedFilter === Filter.All) {
    return todos;
  }

  return todos.filter(
    todo => todo.completed === (selectedFilter === Filter.Completed),
  );
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, setSelectedFilter] = useState<Filter>(Filter.All);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [processingTodoIds, setProcessingTodoIds] = useState<number[]>([]);

  const visibleTodos = useMemo(
    () => getVisibleTodos(todos, selectedFilter),
    [todos, selectedFilter],
  );

  const editInput = useRef<HTMLInputElement>(null);
  const errorTimerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showError = (message: string) => {
    setErrorMessage(message);

    if (errorTimerId.current) {
      clearTimeout(errorTimerId.current);
    }

    errorTimerId.current = setTimeout(() => {
      setErrorMessage('');
    }, 3000);
  };

  useEffect(() => {
    setErrorMessage('');

    getTodos()
      .then(setTodos)
      .catch(() => {
        showError('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!isAddingTodo) {
      editInput.current?.focus();
    }
  }, [isAddingTodo]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const normalizedTitle = title.trim();

    if (normalizedTitle === '') {
      showError('Title should not be empty');

      return;
    }

    const todoToAdd = {
      id: 0,
      userId: USER_ID,
      title: normalizedTitle,
      completed: false,
    };

    setTempTodo(todoToAdd);
    setIsAddingTodo(true);

    createTodo(normalizedTitle)
      .then(newTodo => {
        setTodos(prevTodos => [...prevTodos, newTodo]);
        setTitle('');
      })
      .catch(() => showError('Unable to add a todo'))
      .finally(() => {
        setTempTodo(null);
        setIsAddingTodo(false);
      });
  };

  const handleDelete = (todo: Todo) => {
    setProcessingTodoIds(prevIds => [...prevIds, todo.id]);

    deleteTodo(todo.id)
      .then(() =>
        setTodos(prevTodos => prevTodos.filter(({ id }) => id !== todo.id)),
      )
      .catch(() => showError('Unable to delete a todo'))
      .finally(() => {
        setProcessingTodoIds(prevIds => prevIds.filter(id => id !== todo.id));

        editInput.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(({ completed }) => completed);
    const completedTodoIds = completedTodos.map(({ id }) => id);

    setProcessingTodoIds(prevIds => [...prevIds, ...completedTodoIds]);

    const deletedRequests = completedTodos.map(({ id }) => deleteTodo(id));

    Promise.allSettled(deletedRequests).then(results => {
      const successfullyDeletedTodos: Todo[] = [];

      results.forEach((result, index) => {
        if (result.status === 'fulfilled') {
          successfullyDeletedTodos.push(completedTodos[index]);
        }
      });

      const successfullyDeletedIds = successfullyDeletedTodos.map(
        ({ id }) => id,
      );

      setTodos(prevTodos =>
        prevTodos.filter(todo => !successfullyDeletedIds.includes(todo.id)),
      );

      setProcessingTodoIds(prevIds =>
        prevIds.filter(id => !completedTodoIds.includes(id)),
      );

      if (results.some(result => result.status === 'rejected')) {
        showError('Unable to delete a todo');
      }

      editInput.current?.focus();
    });
  };

  const activeTodosCount = useMemo(() => {
    return todos.filter(todo => todo.completed === false).length;
  }, [todos]);

  const completedTodosCount = useMemo(() => {
    return todos.filter(todo => todo.completed === true).length;
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
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleSubmit}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              ref={editInput}
              value={title}
              onChange={event => setTitle(event.target.value)}
              disabled={isAddingTodo}
            />
          </form>
        </header>

        {(todos.length > 0 || tempTodo !== null) && (
          <>
            <TodoList
              todos={visibleTodos}
              processingTodoIds={processingTodoIds}
              onDelete={handleDelete}
            />

            {tempTodo !== null && (
              <TodoItem todo={tempTodo} isLoading={isAddingTodo} />
            )}

            {todos.length > 0 && (
              <Footer
                activeTodosCount={activeTodosCount}
                completedTodosCount={completedTodosCount}
                selectedFilter={selectedFilter}
                onFilterChange={setSelectedFilter}
                onClearCompleted={handleClearCompleted}
              />
            )}
          </>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
