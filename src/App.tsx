/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { createTodo, deleteTodo, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoFooter } from './components/TodoFooter';
import { TodoList } from './components/TodoList';
import { TodoAppHeader } from './components/TodoAppHeader';
import { utils } from './utils/variables';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorTypes } from './types/ErrorTypes';

export const App: React.FC = () => {
  const { prepearedTodos, USER_ID } = utils;
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [completedTodos, setCompletedTodos] = useState<Todo[]>([]);
  const todoList = prepearedTodos(todos, filterType);

  useEffect(() => {
    setIsLoading(true);
    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(ErrorTypes.loadError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const addTodo = (
    event: React.FormEvent,
  ) => {
    event.preventDefault();
    setIsLoading(true);

    if (newTitle.trim().length === 0) {
      setErrorMessage(ErrorTypes.emptyError);

      return;
    }

    setTempTodo({
      id: 0,
      title: newTitle,
      completed: false,
      userId: USER_ID,
    });

    createTodo({ title: newTitle, completed: false, userId: USER_ID })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setNewTitle('');
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.submitError);
      })
      .finally(() => {
        setTempTodo(null);
        setIsLoading(false);
      });
  };

  const deleteTodoById = (todoId: number) => {
    setIsLoading(true);
    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos => (
          currentTodos.filter(todo => todo.id !== todoId)
        ));
      })
      .catch(() => {
        setErrorMessage(ErrorTypes.deleteError);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const deleteCompletedTodo = () => {
    setIsLoading(true);
    const completedList = todos.filter(todo => todo.completed);

    setCompletedTodos(completedList);

    completedList.forEach(todo => {
      deleteTodo(todo.id)
        .then(() => {
          setTodos(currentTodos => currentTodos.filter(currentTodo => (
            !currentTodo.completed
          )));
        })
        .catch(() => {
          setErrorMessage(ErrorTypes.clearError);
        })
        .finally(() => {
          setIsLoading(false);
          setCompletedTodos([]);
        });
    });
  };

  return (
    <div className="todoapp">
      <div className="is-loading" />
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoAppHeader
          todos={todos}
          tempTodo={tempTodo}
          addTodo={addTodo}
          newTitle={newTitle}
          setNewTitle={setNewTitle}
        />

        <TodoList
          todos={todoList}
          tempTodo={tempTodo}
          deleteTodoById={deleteTodoById}
          isLoading={isLoading}
          completedTodos={completedTodos}
        />

        {todos.length ? (
          <TodoFooter
            todos={todos}
            filterType={filterType}
            setFilterType={setFilterType}
            deleteCompletedTodo={deleteCompletedTodo}
          />
        ) : null}
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          setErrorMessage={setErrorMessage}
        />
      )}
    </div>
  );
};
