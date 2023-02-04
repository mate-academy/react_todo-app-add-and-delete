import React, {
  useCallback, useEffect, useMemo, useState,
} from 'react';
import {
  Footer, Header, Notification, TodoList,
} from './components';
import { ErrorMessage, FilterBy, Todo } from './types';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { countActiveTodos, getFilteredTodos } from './utils';

const USER_ID = 5554;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [processedTodos, setProcessedTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState(FilterBy.ALL);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NONE);

  const visibleTodos = useMemo(
    () => getFilteredTodos(todos, filterBy),
    [todos, filterBy],
  );

  const activeTodosCount = useMemo(() => countActiveTodos(todos), [todos]);
  const hasCompletedTodos = !!(todos.length - activeTodosCount);
  const isFooterVisible = !!(todos.length || tempTodo);

  const creating = useMemo(() => !!tempTodo, [tempTodo]);

  const pushNotification = (message: ErrorMessage) => {
    setHasError(true);
    setErrorMessage(message);
  };

  const clearNotification = useCallback(() => {
    setHasError(false);
  }, []);

  useEffect(() => {
    getTodos(USER_ID)
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
      })
      .catch(() => {
        pushNotification(ErrorMessage.LOAD);
      });
  }, []);

  const handleAdd = useCallback((title: string) => {
    const todoToAdd = {
      id: 0,
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo(todoToAdd);
    clearNotification();

    addTodo(USER_ID, todoToAdd)
      .then((todo) => {
        setTodos((prevTodos) => [...prevTodos, todo]);
      })
      .catch(() => {
        pushNotification(ErrorMessage.LOAD);
      })
      .finally(() => {
        setTempTodo(null);
      });
  }, []);

  const handleDelete = useCallback((todoToDelete: Todo) => {
    clearNotification();
    setProcessedTodos(prevTodos => (
      [...prevTodos, todoToDelete]
    ));
    deleteTodo(USER_ID, todoToDelete.id)
      .then(() => {
        setTodos(prevTodos => (
          prevTodos.filter(todo => todo.id !== todoToDelete.id)
        ));
      })
      .catch(() => {
        pushNotification(ErrorMessage.DELETE);
      })
      .finally(() => {
        setProcessedTodos(prevTodos => (
          prevTodos.filter(todo => todo.id !== todoToDelete.id)
        ));
      });
  }, []);

  const handleDeleteCompleted = useCallback(() => {
    clearNotification();
    const completedTodos = todos.filter(todo => todo.completed);

    setProcessedTodos(prevTodos => (
      [...prevTodos, ...completedTodos]
    ));

    Promise.all(
      completedTodos.map(todo => deleteTodo(USER_ID, todo.id)),
    )
      .then(() => {
        setTodos((prevTodos) => (
          prevTodos.filter(todo => !todo.completed)
        ));
      })
      .catch(() => {
        pushNotification(ErrorMessage.DELETE);
      })
      .finally(() => {
        setProcessedTodos((prevTodos) => (
          prevTodos.filter(todo => !todo.completed)
        ));
      });
  }, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAdd={handleAdd} creating={creating} />

        <TodoList
          todos={visibleTodos}
          processedTodos={processedTodos}
          tempTodo={tempTodo}
          onDelete={handleDelete}
        />

        {isFooterVisible && (
          <Footer
            activeTodosCount={activeTodosCount}
            filterType={filterBy}
            setFilter={setFilterBy}
            isClearButtonVisible={hasCompletedTodos}
            onDeleteCompleted={handleDeleteCompleted}
          />
        )}
      </div>

      <Notification
        visible={hasError}
        message={errorMessage}
        onClear={clearNotification}
      />
    </div>
  );
};
