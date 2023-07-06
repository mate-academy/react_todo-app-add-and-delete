/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { Header } from './components/Header';
import { getTodos, createTodo, removeTodo } from './api/todos';
import { Todo } from './types/Todo';
import { ErrorNotification } from './components/ErrorNotification';

const USER_ID = 10953;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isCompleted, setIsCompleted] = useState('all');
  const [err, setErr] = useState<string | null>(null);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodos, setLoadingTodos] = useState([0]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(todosFromServer => {
        setTodos(todosFromServer);
      })
      .catch(() => setErr('Error: cannot upload todos'));
  }, []);

  useEffect(() => {
    let errorTimer: number;

    if (err) {
      errorTimer = window.setTimeout(() => {
        setErr(null);
      }, 3000);
    }

    return () => {
      clearTimeout(errorTimer);
    };
  }, [err]);

  let visibleTodos = [...todos];
  /* make filter using Enum later */
  const filterByStatus = (todosList: Todo[], todoStatus: boolean) => (
    todosList.filter(todo => todo.completed === todoStatus)
  );

  if (isCompleted === 'completed') {
    visibleTodos = filterByStatus(visibleTodos, true);
  }

  if (isCompleted === 'active') {
    visibleTodos = filterByStatus(visibleTodos, false);
  }

  const addTodo = async (title: string) => {
    try {
      const newTodo = {
        title,
        userId: USER_ID,
        completed: false,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      const createdTodo = await createTodo(newTodo);

      setTodos(prevTodos => [...prevTodos, createdTodo]);
    } catch {
      setErr('Unable to add a todo');
    } finally {
      setTempTodo(null);
    }
  };

  const deleteTodo = async (todoId: number) => {
    try {
      setLoadingTodos(prevIds => [...prevIds, todoId]);
      await removeTodo(todoId);
      setTodos(prevTodos => prevTodos.filter(todo => todo.id !== todoId));
    } catch {
      setErr('Unable to delete a todo');
    } finally {
      setLoadingTodos(prevIds => prevIds.filter(id => id !== todoId));
    }
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErr={setErr}
          addTodo={addTodo}
          tempTodo={tempTodo}
        />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          loadingTodos={loadingTodos}
          deleteTodo={deleteTodo}
        />

        {visibleTodos.length > 0 && (
          <TodoFilter
            todos={visibleTodos}
            isCompleted={isCompleted}
            setIsCompleted={setIsCompleted}
          />
        )}
      </div>

      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <ErrorNotification
        err={err}
        setErr={setErr}
      />
    </div>
  );
};
