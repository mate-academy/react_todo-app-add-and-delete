import React, { useEffect, useRef, useState } from 'react';

import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';

import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList';
import { TodoForm } from './components/TodoForm';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todoList, setTodoList] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const errorTimerId = useRef(0);

  const addNewTodo = (newTodo: Todo) => {
    setTodoList(currentList => [...currentList, newTodo]);
  };

  const removeTodo = (id: number) => {
    setTodoList(currentList => currentList.filter(todo => todo.id !== id));
  };

  const showErrorMessage = (message: string, delay = 3000) => {
    clearInterval(errorTimerId.current);
    setErrorMessage(message);
    errorTimerId.current = window.setTimeout(() => setErrorMessage(''), delay);
  };

  const handleErrorRemove = () => {
    setErrorMessage('');
  };

  useEffect(() => {
    getTodos()
      .then(setTodoList)
      .catch(() => showErrorMessage('Unable to load todos'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoForm
          todoList={todoList}
          addNewTodo={addNewTodo}
          setTempTodo={setTempTodo}
          showErrorMessage={showErrorMessage}
        />
        {todoList && (
          <TodoList
            todoList={todoList}
            tempTodo={tempTodo}
            removeTodo={removeTodo}
            showErrorMessage={showErrorMessage}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        handleErrorRemove={handleErrorRemove}
      />
    </div>
  );
};
