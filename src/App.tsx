/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';

import {
  USER_ID,
  getTodosFromServer,
  postTodoToServer,
  deleteTodoFromServer,
} from './api/todos';

import { Todo } from './types/Todo';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';
import { ErrorNotification } from './components/ErrorNotification';
import { ErrorTypes } from './types/Error';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorCases, setErrorCases] = useState<ErrorTypes>({
    todoLoad: false,
    titleLength: false,
    addTodo: false,
    deleteTodo: false,
    updateTodo: false,
  });
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const [completeFilter, setCompleteFilter] = useState<null | boolean>(null);

  const updateErrorCases = (
    value: boolean,
    errorTitle: keyof ErrorTypes | 'all' = 'all',
  ) => {
    if (errorTitle === 'all') {
      setErrorCases({
        todoLoad: false,
        titleLength: false,
        addTodo: false,
        deleteTodo: false,
        updateTodo: false,
      });
    } else {
      setErrorCases(prev => ({
        ...prev,
        [errorTitle]: value,
      }));
    }
  };

  useEffect(() => {
    getTodosFromServer()
      .then(serverTodos => {
        setTodos(
          serverTodos.map(todo => ({
            ...todo,
            isFromServer: true,
          })),
        );
        updateErrorCases(false, 'todoLoad');
      })
      .catch(() => {
        updateErrorCases(true, 'todoLoad');
      });
  }, []);

  const todoInput = useRef<HTMLInputElement>(null);

  const generateId = () => {
    return Math.floor(Math.random() * 2137);
  };

  useEffect(() => {
    todoInput.current?.focus();
  }, [todos, updateErrorCases]);

  const addTodo = async (tempTodoTitle: string) => {
    let didSucceed = false;

    if (tempTodoTitle.trim() === '') {
      updateErrorCases(true, 'titleLength');
    } else {
      updateErrorCases(false, 'titleLength');
      setTempTodo({
        title: tempTodoTitle.trim(),
        userId: USER_ID,
        completed: false,
        id: generateId(),
      });
      setIsInputDisabled(true);
      await postTodoToServer({
        title: tempTodoTitle.trim(),
        userId: USER_ID,
        completed: false,
        id: generateId(),
      })
        .then(addedTodo => {
          setTodos(prev => [...prev, addedTodo]);
          updateErrorCases(false, 'addTodo');
          didSucceed = true;
        })
        .catch(() => {
          updateErrorCases(true, 'addTodo');
        })
        .finally(() => {
          setIsInputDisabled(false);
          setTempTodo(null);
        });
    }

    return didSucceed;
  };

  const deleteTodo = async (todoId: number) => {
    let didSucceed = false;

    await deleteTodoFromServer(todoId)
      .then(() => {
        didSucceed = true;
        setTodos(prev => prev.filter(({ id }) => id !== todoId));
      })
      .catch(() => {
        updateErrorCases(true, 'deleteTodo');
      });

    return didSucceed;
  };

  const deleteFinishedTodos = async () => {
    const todosToDelete = todos
      .filter(({ completed }) => completed)
      .map(({ id }) => id);

    todosToDelete.forEach(todoId => {
      deleteTodo(todoId);
    });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  const todosToDisplay = todos.filter(
    ({ completed }) => completeFilter === null || completed !== completeFilter,
  );

  const handleCompleteTodo = (todoId: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === todoId) {
        return {
          ...todo,
          completed: !todo.completed,
        };
      }

      return todo;
    });

    setTodos(updatedTodos);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          addTodo={addTodo}
          isInputDisabled={isInputDisabled}
          todoInput={todoInput}
        />
        <TodoList
          todos={todosToDisplay}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          handleCompleteTodo={handleCompleteTodo}
        />
        {todos.length !== 0 && (
          <Footer
            todos={todos}
            completeFilter={completeFilter}
            setCompleteFilter={setCompleteFilter}
            deleteFinishedTodos={deleteFinishedTodos}
          />
        )}
      </div>
      <ErrorNotification
        errorCases={errorCases}
        updateErrorCases={updateErrorCases}
      />
    </div>
  );
};
