// #region import
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, getTodos, removeTodo, USER_ID } from './api/todos';

import { Todo } from './types/Todo';
import { ErrorMessage } from './types/ErrorMessage';
import { FiltersList } from './types/FiltersList';

import { TodoList } from './components/TodoList';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { ErrorBlock } from './components/ErrorBlock';
// #endregion

export const App: React.FC = () => {
  // #region 1 state
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | ''>('');
  const [filter, setFilter] = useState<FiltersList>(FiltersList.all);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [processingIds, setProcessingIds] = useState<number[]>([]);
  // #endregion

  // #region 2 constant
  const itemsLeft = todoList.filter(todo => !todo.completed).length;
  const hasCompleted = todoList.some(todo => todo.completed);
  const visibleTodos = todoList.filter(todo => {
    switch (filter) {
      case FiltersList.active:
        return !todo.completed;
      case FiltersList.completed:
        return todo.completed;
      default:
        return true;
    }
  });
  // #endregion

  // #region 3 effects
  useEffect(() => {
    getTodos()
      .then(setTodoList)
      .catch(() => setErrorMessage(ErrorMessage.LoadTodos));
  }, []);

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timerId = setTimeout(() => setErrorMessage(''), 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);
  // #endregion

  // #region 4 handlers
  const addTodo = (title: string) => {
    const newTodo = { userId: USER_ID, title, completed: false };

    setErrorMessage('');
    setTempTodo({ id: 0, ...newTodo });

    return createTodo(newTodo)
      .then(result => setTodoList(currentTodos => [...currentTodos, result]))
      .catch(error => {
        setErrorMessage(ErrorMessage.AddTodo);
        throw error;
      })
      .finally(() => setTempTodo(null));
  };

  const deleteTodo = (todoId: number) => {
    setErrorMessage('');
    setProcessingIds(currentIds => [...currentIds, todoId]);

    return removeTodo(todoId)
      .then(() =>
        setTodoList(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        ),
      )
      .catch(() => setErrorMessage(ErrorMessage.DeleteTodo))
      .finally(() =>
        setProcessingIds(currentIds => currentIds.filter(id => id !== todoId)),
      );
  };

  const clearCompleted = () => {
    todoList
      .filter(todo => todo.completed)
      .forEach(todo => deleteTodo(todo.id));
  };
  // #endregion

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todoList={todoList}
          onError={setErrorMessage}
          onAdd={addTodo}
          isDisabled={tempTodo !== null}
        />

        {(todoList.length > 0 || tempTodo) && (
          <TodoList
            todoList={visibleTodos}
            tempTodo={tempTodo}
            processingIds={processingIds}
            onDelete={deleteTodo}
          />
        )}

        {todoList.length > 0 && (
          <Footer
            itemsLeft={itemsLeft}
            filter={filter}
            onFilterChange={setFilter}
            hasCompleted={!hasCompleted}
            onClearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorBlock errorMessage={errorMessage} onClose={setErrorMessage} />
    </div>
  );
};
