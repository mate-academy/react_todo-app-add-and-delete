import React, { useEffect, useRef, useState } from 'react';
import * as postServise from './api/todos';
import { Todo } from './types/Todo';
import { Actions } from './types/Actions';
import { ListOfTodos } from './components/ListOfTodos';
import { FooterTodos } from './components/FooterTodos';
import { ErrorNotification } from './components/ErrorNotification';
import { focusInput } from './utils/focusInput';
import HeaderTodos from './components/HeaderTodos/HeaderTodos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState('');
  const [showNotification, setShowNotification] = useState(true);
  const [filterActions, setFilterActions] = useState<Actions>(Actions.ALL);
  const [loading, setLoading] = useState<{ [key: number]: boolean }>({});
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const timeoutId = useRef<number | null>(null);
  const inputRef = useRef<{ focus: () => void }>(null);

  useEffect(() => {
    focusInput(inputRef);

    postServise
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setShowNotification(false);
        setError('Unable to load todos');
        timeoutId.current = window.setTimeout(() => {
          setShowNotification(true);
        }, 3000);
      });

    return () => {
      if (timeoutId.current !== null) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  const errorNotification = (message: string) => {
    setShowNotification(false);
    setError(message);
    if (timeoutId.current !== null) {
      clearTimeout(timeoutId.current);
    }

    timeoutId.current = window.setTimeout(() => {
      setShowNotification(true);
    }, 3000);
  };

  const deleteTodo = (todoId: number) => {
    setLoading(prevLoading => ({ ...prevLoading, [todoId]: true }));
    postServise
      .deleteTodos(todoId)
      .then(() =>
        setTodos(currentTodos =>
          currentTodos.filter(({ id }) => id !== todoId),
        ),
      )
      .catch(() => {
        errorNotification('Unable to delete a todo');
      })
      .finally(() => {
        setLoading(prevLoading => {
          const { [todoId]: ignored, ...rest } = prevLoading;

          return rest;
        });
        focusInput(inputRef);
      });
  };

  const clearCompleted = async () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletePromises = completedTodos.map(
      todo =>
        new Promise<void>(resolve => {
          deleteTodo(todo.id);
          resolve();
        }),
    );

    await Promise.allSettled(deletePromises);
  };

  const handleLoading = (newTodo: Todo, type: string) => {
    switch (type) {
      case 'turnOn':
        setLoading(prev => ({ ...prev, [newTodo.id]: true }));
        break;
      case 'turnOff':
        setLoading(prev => {
          const { [newTodo.id]: ignored, ...rest } = prev;

          return rest;
        });
        break;
    }
  };

  const setTodosFormServer = (todoFromServer: Todo) => {
    setTodos(currentTodos => [...currentTodos, todoFromServer as Todo]);
  };

  const hasCompletedTodos = todos.some(todo => todo.completed);

  const checkCompleted = todos?.every(todo => todo.completed === true);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <HeaderTodos
          checkCompleted={checkCompleted}
          errorNotification={errorNotification}
          ref={inputRef}
          setTempTodo={setTempTodo}
          setTodos={setTodosFormServer}
          setLoading={handleLoading}
        />

        <ListOfTodos
          todos={todos}
          actions={filterActions}
          onDelete={deleteTodo}
          loading={loading}
          tempTodo={tempTodo}
        />

        <FooterTodos
          todos={todos}
          handleAction={setFilterActions}
          hasComletedTodos={hasCompletedTodos}
          clearCompleted={() => clearCompleted()}
        />
      </div>

      <ErrorNotification
        showNotification={showNotification}
        errorMessage={error}
        deleteNotification={setShowNotification}
      />
    </div>
  );
};
