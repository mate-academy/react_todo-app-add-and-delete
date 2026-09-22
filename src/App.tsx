// #region Import
/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { createTodo, deleteTodo, getTodos, USER_ID } from './api/todos';

import { Todo } from './types/Todo';

import { ErrorNotification } from './components/ErrorNotification';
import { NewTodo } from './components/newTodo';
import { TodoList } from './components/TodoList';
import { FILTER, FilterType } from './constants/Filter';
import { TodoFooter } from './components/TodoFooter';
import { UserWarning } from './UserWarning';
import { TodoItem } from './components/TodoItem';
// #endregion

export const App: React.FC = () => {
  // #region useState
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<FilterType>(FILTER.all);
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingTodos, setProcessingTodos] = useState<number[]>([]);
  const newTodoInputRef = useRef<HTMLInputElement>(null);
  // #endregion

  // #region useEffect
  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
      });
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);
  // #endregion

  // #region handle
  const handleAddTodo = (title: string): Promise<void> => {
    const temporaryTodo: Todo = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(temporaryTodo);
    setIsAdding(true);

    return createTodo(temporaryTodo)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(() => {
        setErrorMessage('Unable to add a todo');
        throw new Error('Unable to add todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setProcessingTodos(currentIds => [...currentIds, todoId]);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
      })
      .finally(() => {
        setProcessingTodos(currentIds =>
          currentIds.filter(id => id !== todoId),
        );
        newTodoInputRef.current?.focus();
      });
  };

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const completedTodosIds = completedTodos.map(todo => todo.id);

    setProcessingTodos(currentIds => [
      ...currentIds,
      ...completedTodosIds.filter(id => !currentIds.includes(id)),
    ]);

    const results = await Promise.all(
      completedTodos.map(todo =>
        deleteTodo(todo.id)
          .then(() => ({ id: todo.id, success: true }))
          .catch(() => ({ id: todo.id, success: false })),
      ),
    );

    const deletedTodoIds = results
      .filter(result => result.success)
      .map(result => result.id);

    setTodos(currentTodos =>
      currentTodos.filter(todo => !deletedTodoIds.includes(todo.id)),
    );

    if (results.some(result => !result.success)) {
      setErrorMessage('Unable to delete a todo');
    }

    setProcessingTodos(currentIds =>
      currentIds.filter(id => !completedTodosIds.includes(id)),
    );
    newTodoInputRef.current?.focus();
  };
  // #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  const visibleTodos = todos.filter(todo => {
    if (filter === FILTER.active) {
      return !todo.completed;
    }

    if (filter === FILTER.completed) {
      return todo.completed;
    }

    return true;
  });

  const activeTodosCounter = todos.filter(todo => !todo.completed).length;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this button should have `active` class only if all todos are completed */}

          {todos.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todos.length > 0 && todos.every(todo => todo.completed),
              })}
              data-cy="ToggleAllButton"
            />
          )}
          <NewTodo
            onAdd={handleAddTodo}
            onEmpty={() => setErrorMessage('Title should not be empty')}
            isAdding={isAdding}
            inputRef={newTodoInputRef}
          />
        </header>

        {todos.length > 0 && (
          <TodoList
            todos={visibleTodos}
            onDelete={handleDeleteTodo}
            processingTodos={processingTodos}
          />
        )}

        {tempTodo && <TodoItem todo={tempTodo} isProcessed />}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <TodoFooter
            activeTodosCounter={activeTodosCounter}
            filter={filter}
            onFilterChange={setFilter}
            hasCompletedTodos={todos.some(todo => todo.completed)}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        message={errorMessage}
        onHide={() => setErrorMessage('')}
      />
    </div>
  );
};
