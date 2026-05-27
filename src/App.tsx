/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { UserWarning } from './UserWarning';
import React, { useEffect, useRef, useState } from 'react';
import * as todosService from './api/todos';

import { Todo } from './types/Todo';
import { StatusTodo } from './types/StatusTodo';
import { ErrorMessage } from './types/ErrorMessage';

import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusTodo, setStatusTodo] = useState(StatusTodo.All);
  const [todoTitle, setTodoTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadingTodoId, setLoadingTodoId] = useState<number | null>(null);

  const hasCompletedTodos = todos.some(
    todoCompleted => todoCompleted.completed,
  );

  const toggleTodo = (id: number) => {
    setTodos(prev =>
      prev.map(todoV =>
        todoV.id === id ? { ...todoV, completed: !todoV.completed } : todoV,
      ),
    );
  };

  const filteredTodos = todos.filter(todo => {
    return (
      statusTodo === StatusTodo.All ||
      (statusTodo === StatusTodo.Active && !todo.completed) ||
      (statusTodo === StatusTodo.Completed && todo.completed)
    );
  });

  const activeTodos = todos.filter(todo => !todo.completed);
  const inputRef = useRef<HTMLInputElement>(null);

  function deleteTodo(todoId: number) {
    setLoadingTodoId(todoId);

    todosService
      .deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.DeleteTodo);
      })
      .finally(() => {
        setLoading(false);
        inputRef.current?.focus();
      });
  }

  function addTodo({ title, userId, completed }: Todo) {
    setLoading(true);

    todosService
      .postTodo({ title, userId, completed })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTodoTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.AddTodo);
      })
      .finally(() => {
        setLoading(false);
        setTempTodo(null);
      });
  }

  function clearCompleted() {
    const completedTodos = todos.filter(todo => todo.completed);

    completedTodos.forEach(todo => {
      deleteTodo(todo.id);
    });
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const trimmedTitle = todoTitle.trim();

    if (!trimmedTitle) {
      setErrorMessage(ErrorMessage.HandleSubmit);

      return;
    }

    const newTempTodo = {
      id: 0,
      title: trimmedTitle,
      userId: todosService.USER_ID,
      completed: false,
    };

    setTempTodo(newTempTodo);

    addTodo({
      id: 0,
      title: trimmedTitle,
      userId: todosService.USER_ID,
      completed: false,
    });
  };

  useEffect(() => {
    if (!errorMessage) {
      return;
    }

    const timer = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  useEffect(() => {
    inputRef.current?.focus();
  }, [loading]);

  useEffect(() => {
    todosService
      .getTodos()
      .then(setTodos)
      .catch(() => setErrorMessage(ErrorMessage.LoadTodo));
  }, []);

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          activeTodos={activeTodos}
          handleSubmit={handleSubmit}
          todoTitle={todoTitle}
          setTodoTitle={setTodoTitle}
          loading={loading}
          inputRef={inputRef}
        />

        <TodoList
          filteredTodos={filteredTodos}
          toggleTodo={toggleTodo}
          deleteTodo={deleteTodo}
          loadingTodoId={loadingTodoId}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <Footer
            activeTodos={activeTodos}
            statusTodo={statusTodo}
            setStatusTodo={setStatusTodo}
            hasCompletedTodos={hasCompletedTodos}
            clearCompleted={clearCompleted}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={() => setErrorMessage('')}
      />
    </div>
  );
};
