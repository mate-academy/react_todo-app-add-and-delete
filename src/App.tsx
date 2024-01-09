/* eslint-disable max-len */
import React, { useEffect, useState } from 'react';
import { Todo } from './types/Todo';
import { deleteTodos, getTodos } from './api/todos';
import { USER_ID, wait } from './utils/fetchClient';
import { Status } from './types/Status';
import { TodosFilters } from './components/TodosFilters';
import { TodosList } from './components/TodosList';
import { Error } from './types/Error';
import { TodosHeader } from './components/TodosHeader';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [status, setStatus] = useState<Status>(Status.all);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  useEffect(() => {
    setErrorMessage('');

    getTodos(USER_ID)
      .then(setTodos)
      .catch(() => setErrorMessage(Error.get));
  }, []);

  useEffect((errorShowTime = 3000) => {
    if (errorMessage.length) {
      wait(errorShowTime).then(() => setErrorMessage(''));
    }
  }, [errorMessage]);

  const activeQty = todos.filter(todo => !todo.completed).length;
  const isAnyComplited = todos.length - activeQty > 0;

  const handleClearCompleted = () => {
    todos.forEach(todo => {
      if (todo.completed) {
        const currentId = todo.id;

        deleteTodos(currentId.toString())
          .catch(() => setErrorMessage(Error.delete))
          .then(() => getTodos(USER_ID)
            .then(setTodos)
            .catch(() => setErrorMessage(Error.get)));
      }
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodosHeader
          todos={todos}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          onError={setErrorMessage}
        />

        <TodosList
          todos={todos}
          setTodos={setTodos}
          tempTodo={tempTodo}
          status={status}
          onError={setErrorMessage}
        />

        {todos.length !== 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${activeQty} items left`}
            </span>

            <TodosFilters
              status={status}
              setStatus={setStatus}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled={!isAnyComplited}
            >
              Clear completed
            </button>
          </footer>
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </div>
  );
};
