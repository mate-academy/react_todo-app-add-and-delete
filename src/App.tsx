/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { addTodo, deleteTodo, getTodos } from './api/todos';
import { Filter } from './components/Filter/Filter';
import { Header } from './components/Header';
import { Notification } from './components/Notification';
import { TodoList } from './components/TodoList';
import { ErrorMessage } from './types/ErrorMessage';
import { Status } from './types/Status';
import { Todo } from './types/Todo';

const USER_ID = 6385;

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [performancedTodo, setPerformancedTodo] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [error, setError] = useState(ErrorMessage.None);
  const [status, setStatus] = useState(Status.All);

  const completedTodos = todos.filter(todo => todo.completed);
  const hasCompletedTodos = completedTodos.length > 0;
  const countOfActiveTodos = todos.length - completedTodos.length;

  let visibleTodos = [...todos];

  if (status !== Status.All) {
    visibleTodos = visibleTodos.filter(todo => {
      switch (status) {
        case Status.Active:
          return !todo.completed;
        case Status.Completed:
          return todo.completed;
        default:
          throw new Error('Incorrect status');
      }
    });
  }

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const receivedTodos = await getTodos(USER_ID);

        setTodos(receivedTodos);
      } catch {
        setError(ErrorMessage.Load);
      }
    };

    fetchTodos();
  }, []);

  const closeNotification = () => {
    setError(ErrorMessage.None);
  };

  const handleAddNewTodo = async (newTodoTitle: string) => {
    closeNotification();

    if (!newTodoTitle.trim) {
      setError(ErrorMessage.Title);

      return;
    }

    const todoToAdd = {
      id: 0,
      userId: USER_ID,
      title: newTodoTitle,
      completed: false,
    };

    try {
      setTempTodo(todoToAdd);

      const newTodo = await addTodo(USER_ID, todoToAdd);

      setTodos(prevTodos => ([...prevTodos, newTodo]));
    } catch {
      setError(ErrorMessage.Add);
    } finally {
      setTempTodo(null);
    }
  };

  const handleDeleteTodo = async (todoToDelete: Todo) => {
    closeNotification();
    setPerformancedTodo(prevTodos => [...prevTodos, todoToDelete]);

    try {
      await deleteTodo(todoToDelete.id);
      setTodos(prevTodos => prevTodos.filter(
        todo => todo.id !== todoToDelete.id,
      ));
    } catch {
      setError(ErrorMessage.Delete);
    } finally {
      setPerformancedTodo(prevTodos => (
        prevTodos.filter(todo => todo.id !== todoToDelete.id)
      ));
    }
  };

  const handleCompletedTodos = async () => {
    completedTodos.forEach(todo => handleDeleteTodo(todo));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header onAddNewTodo={handleAddNewTodo} />

        <TodoList
          todos={visibleTodos}
          tempTodo={tempTodo}
          removeTodo={handleDeleteTodo}
          performancedTodo={performancedTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${countOfActiveTodos} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <Filter
              status={status}
              setStatus={setStatus}
            />

            {/* don't show this button if there are no completed todos */}
            <button
              type="button"
              className="todoapp__clear-completed"
              disabled={!hasCompletedTodos}
              onClick={handleCompletedTodos}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>
      {/* Notification is shown in case of any error */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <Notification
        error={error}
        closeNotification={closeNotification}
      />
    </div>
  );
};
