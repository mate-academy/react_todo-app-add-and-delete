/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';

import * as todoServices from './api/todos';
import { ErrorMessage } from './utils/ErrorMessage';

import { Todo } from './types/Todo';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { TodoList } from './components/TodoList';

export enum FilterStatus {
  All = 'All',
  Active = 'Active',
  Completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [isDeletingTodoCompleted, setIsDeletingTodoCompleted] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');

  const showError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  // const showError = (message: string) => {
  //   setErrorMessage(message);
  //   setTimeout(() => {
  //     setErrorMessage('');
  //   }, 3000);
  // };

  useEffect(() => {
    setErrorMessage('');

    todoServices
      .getTodos()
      .then(setTodos)
      .catch(() => {
        showError(ErrorMessage.LOAD_TODOS_FAILED);
      });
  }, [showError]);

  if (!todoServices.USER_ID) {
    return <UserWarning />;
  }

  //#region filterTodos
  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case FilterStatus.Active:
        return !todo.completed;
      case FilterStatus.Completed:
        return todo.completed;
      case FilterStatus.All:
      default:
        return true;
    }
  });

  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  //#endregion

  //#region addTodo
  async function handleAddTodo() {
    const normalizedTitle = newTodoTitle.trim();

    if (!normalizedTitle) {
      showError(ErrorMessage.TITLE_EMPTY);

      return;
    }

    setErrorMessage('');

    const newTempTodo: Todo = {
      id: 0,
      userId: todoServices.USER_ID,
      title: normalizedTitle,
      completed: false,
    };

    setTempTodo(newTempTodo);

    try {
      const addedTodo = await todoServices.addTodo(normalizedTitle);

      setTodos(prevTodos => [...prevTodos, addedTodo]);
      setNewTodoTitle('');
    } catch (error) {
      showError(ErrorMessage.ADD_TODO_FAILED);
    } finally {
      setTempTodo(null);
    }
  }

  const isAddingTodo = tempTodo !== null;
  //#endregion

  //#region deleteTodo

  async function handleDeleteTodo(id: number) {
    setDeletingTodoId(id);
    setErrorMessage('');

    try {
      await todoServices.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      showError(ErrorMessage.DELETE_TODO_FAILED);
    } finally {
      setDeletingTodoId(null);
    }
  }

  //#endregion

  //#region clearCompleted

  async function handleClearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    setErrorMessage('');
    setIsDeletingTodoCompleted(true);

    const deletePromises = completedTodos.map(todo =>
      todoServices.deleteTodo(todo.id),
    );

    try {
      const result = await Promise.allSettled(deletePromises);
      const deletedTodoIds: number[] = [];
      let hasError = false;

      result.forEach((res, index) => {
        if (res.status === 'fulfilled') {
          deletedTodoIds.push(completedTodos[index].id);
        } else {
          hasError = true;
        }
      });

      setTodos(prevTodos =>
        prevTodos.filter(todo => !deletedTodoIds.includes(todo.id)),
      );

      if (hasError) {
        showError(ErrorMessage.DELETE_TODO_FAILED);
      }
    } catch (error) {
      showError(ErrorMessage.DELETE_TODO_FAILED);
    } finally {
      setIsDeletingTodoCompleted(false);
    }
  }

  //#endregion

  const isDeletingAnyTodo = deletingTodoId !== null || isDeletingTodoCompleted;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoHeader
          onAddTodo={handleAddTodo}
          newTodoTitle={newTodoTitle}
          setNewTodoTitle={setNewTodoTitle}
          isAddingTodo={isAddingTodo}
          isDeletingAnyTodo={isDeletingAnyTodo}
        />
        <TodoList
          todos={visibleTodos}
          onDeleteTodo={handleDeleteTodo}
          deletingTodoId={deletingTodoId}
        />

        {isAddingTodo && (
          <TodoItem key="temp-todo-loader" todo={tempTodo} isTemp={true} />
        )}

        {/* Hide the footer if there are no todos */}
        {todos.length > 0 && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
            totalTodos={todos.length}
          />
        )}
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage('')}
      />
    </div>
  );
};
