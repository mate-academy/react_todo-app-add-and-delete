/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';

import * as todoServices from './api/todos';
import { ErrorMessage } from './utils/ErrorMessage';

import { Todo } from './types/Todo';
import { TodoFooter } from './components/TodoFooter';
import { TodoHeader } from './components/TodoHeader';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoItem } from './components/TodoItem';
import { TodoList } from './components/TodoList';
import { FilterStatus } from './utils/FilterStatus';

export const App: React.FC = () => {
  //#region State declarations
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterStatus>(FilterStatus.All);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);
  const [isDeletingTodoCompleted, setIsDeletingTodoCompleted] = useState(false);

  const [errorMessage, setErrorMessage] = useState<ErrorMessage>(
    ErrorMessage.DEFAULT_ERROR,
  );

  //#endregion

  //#region UseEffect to load
  useEffect(() => {
    setErrorMessage(ErrorMessage.DEFAULT_ERROR);

    todoServices
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorMessage.LOAD_TODOS_FAILED);
      });
  }, []);

  if (!todoServices.USER_ID) {
    return <UserWarning />;
  }

  //#endregion

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

  //#endregion

  //#region addTodo
  const handleAddTodo = async () => {
    const normalizedTitle = newTodoTitle.trim();

    if (!normalizedTitle) {
      setErrorMessage(ErrorMessage.TITLE_EMPTY);

      return;
    }

    setErrorMessage(ErrorMessage.DEFAULT_ERROR);

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
      setErrorMessage(ErrorMessage.ADD_TODO_FAILED);
    } finally {
      setTempTodo(null);
    }
  };

  //#endregion

  //#region deleteTodo

  const handleDeleteTodo = async (id: number) => {
    setDeletingTodoId(id);
    setErrorMessage(ErrorMessage.DEFAULT_ERROR);

    try {
      await todoServices.deleteTodo(id);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== id));
    } catch (error) {
      setErrorMessage(ErrorMessage.DELETE_TODO_FAILED);
    } finally {
      setDeletingTodoId(null);
    }
  };

  //#endregion

  //#region clearCompleted

  const handleClearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    setErrorMessage(ErrorMessage.DEFAULT_ERROR);
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
        setErrorMessage(ErrorMessage.DELETE_TODO_FAILED);
      }
    } catch (error) {
      setErrorMessage(ErrorMessage.DELETE_TODO_FAILED);
    } finally {
      setIsDeletingTodoCompleted(false);
    }
  };

  //#endregion

  const isAddingTodo = tempTodo !== null;
  const isDeletingAnyTodo = deletingTodoId !== null || isDeletingTodoCompleted;
  const activeTodosCount = todos.filter(todo => !todo.completed).length;
  const showFooter = todos.length > 0;

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

        {showFooter && (
          <TodoFooter
            activeTodosCount={activeTodosCount}
            filter={filter}
            setFilter={setFilter}
            onClearCompleted={handleClearCompleted}
            totalTodos={todos.length}
          />
        )}
      </div>

      <ErrorNotification
        message={errorMessage}
        onClose={() => setErrorMessage(ErrorMessage.DEFAULT_ERROR)}
      />
    </div>
  );
};
