/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useCallback, useEffect, useState } from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { FilterBy } from './types/Filter';
import { Todo } from './types/Todo';
import { getFiltredTodos } from './utils/getFiltredTodos';

const USER_ID = 6392;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.ALL);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage]
    = useState<ErrorMessage>(ErrorMessage.NONE);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todoTitle, setTodoTitle] = useState('');
  const [isBeingAdded, setIsBeingAdded] = useState(false);

  const showError = (message: ErrorMessage) => {
    setHasError(true);
    setErrorMessage(message);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then(fetchTodos => {
        setTodos(fetchTodos);
      })
      .catch(() => {
        setHasError(true);
        setErrorMessage(ErrorMessage.ONLOAD);
      });
  }, []);

  const visibleTodos = getFiltredTodos(todos, filterBy);

  const countActiveTodos = todos.filter(todo => !todo.completed).length;
  const isFooterVisible = !!todos.length;
  const isClearButtonVisible = !!(todos.length - countActiveTodos);

  const clearNotification = useCallback(() => {
    setHasError(false);
  }, []);

  const handleAddTodo = useCallback((title: string) => {
    clearNotification();

    if (!title.trim()) {
      showError(ErrorMessage.ONTITLE);
      setTodoTitle('');

      return;
    }

    const todoToAdd = {
      id: 0,
      userId: USER_ID,
      completed: false,
      title,
    };

    setTempTodo(todoToAdd);
    setIsBeingAdded(true);

    addTodo(USER_ID, todoToAdd)
      .then(todo => {
        setTodos(curTodos => [...curTodos, todo]);
        setTodoTitle('');
      })
      .catch(() => {
        showError(ErrorMessage.ONADD);
      })
      .finally(() => {
        setTempTodo(null);
        setIsBeingAdded(false);
      });
  }, []);

  const handleDeleteTodo = useCallback((todoId: number) => {
    clearNotification();

    deleteTodo(todoId)
      .then(() => {
        setTodos(curTodos => (
          curTodos.filter(todo => todo.id !== todoId)
        ));
      })
      .catch(() => {
        showError(ErrorMessage.ONDELETE);
      });
  }, []);

  const handleDeleteCompletedTodos = useCallback(() => {
    todos.forEach(todo => {
      if (todo.completed) {
        handleDeleteTodo(todo.id);
      }
    });
  }, []);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          onAddTodo={handleAddTodo}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          isBeingAdded={isBeingAdded}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          isBeingAdded={isBeingAdded}
          onRemove={handleDeleteTodo}
        />

        {isFooterVisible && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            countActiveTodos={countActiveTodos}
            isClearButtonVisible={isClearButtonVisible}
            onClearCompleted={handleDeleteCompletedTodos}
          />
        )}
      </div>

      <Notification
        hasError={hasError}
        errorMessage={errorMessage}
        onClear={clearNotification}
      />
    </div>
  );
};
