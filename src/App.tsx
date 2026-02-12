import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Todo } from './types/Todo';
import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { NewTodoField } from './components/NewTodoField';
import { ErrorNotification } from './components/ErrorNotification';
import { Filter } from './enums/Filter';
import { ErrorType } from './enums/ErrorType';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState(Filter.All);
  const [errorMessage, setErrorMessage] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [processingIds, setProcessingIds] = useState<number[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(true);

    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorType.Load);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isCreating) {
      inputRef.current?.focus();
    }
  }, [isCreating]);

  const completedCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );
  const activeCount = todos.length - completedCount;

  const visibleTodos = useMemo(
    () =>
      todos.filter(todo => {
        switch (filter) {
          case Filter.Active:
            return !todo.completed;

          case Filter.Completed:
            return todo.completed;

          default:
            return true;
        }
      }),
    [filter, todos],
  );

  const handleAddTodo = () => {
    const trimmedTitle = newTitle.trim();

    setErrorMessage('');

    if (!trimmedTitle) {
      setErrorMessage(ErrorType.EmptyTitle);
      inputRef.current?.focus();

      return;
    }

    const todoToCreate = {
      title: trimmedTitle,
      completed: false,
      userId: USER_ID,
    };

    setIsCreating(true);
    setTempTodo({ ...todoToCreate, id: 0 });

    addTodo(todoToCreate)
      .then(createdTodo => {
        setTodos(currentTodos => [...currentTodos, createdTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorType.Add);
      })
      .finally(() => {
        setTempTodo(null);
        setIsCreating(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setErrorMessage('');
    setProcessingIds(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorType.Delete);
      })
      .finally(() => {
        setProcessingIds(currentIds => currentIds.filter(id => id !== todoId));
        inputRef.current?.focus();
      });
  };

  const handleClearCompleted = () => {
    const completedIds = todos
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    if (completedIds.length === 0) {
      return;
    }

    setErrorMessage('');
    setProcessingIds(currentIds => [...currentIds, ...completedIds]);

    Promise.allSettled(completedIds.map(id => deleteTodo(id))).then(results => {
      const failedIds = completedIds.filter(
        (_, index) => results[index].status === 'rejected',
      );
      const successfulIds = completedIds.filter(
        (_, index) => results[index].status === 'fulfilled',
      );

      if (failedIds.length > 0) {
        setErrorMessage(ErrorType.Delete);
      }

      if (successfulIds.length > 0) {
        setTodos(currentTodos =>
          currentTodos.filter(todo => !successfulIds.includes(todo.id)),
        );
      }

      setProcessingIds(currentIds =>
        currentIds.filter(id => !completedIds.includes(id)),
      );
      inputRef.current?.focus();
    });
  };

  const hasTodos = todos.length > 0 || Boolean(tempTodo);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <NewTodoField
          value={newTitle}
          disabled={isCreating}
          inputRef={inputRef}
          onChange={setNewTitle}
          onSubmit={handleAddTodo}
        />

        {!isLoading && hasTodos && (
          <TodoList
            todos={visibleTodos}
            processingIds={processingIds}
            tempTodo={tempTodo}
            onDelete={handleDeleteTodo}
          />
        )}

        {!isLoading && todos.length > 0 && (
          <Footer
            activeCount={activeCount}
            completedCount={completedCount}
            filter={filter}
            onFilterChange={setFilter}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        isVisible={Boolean(errorMessage)}
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />

      {isLoading && (
        <div data-cy="TodoLoader" className="modal overlay is-active">
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      )}
    </div>
  );
};
