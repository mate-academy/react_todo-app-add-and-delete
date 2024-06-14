import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';

import { UserWarning } from './UserWarning';
import { USER_ID, getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { TodoList } from './Components/TodoList';
import { Footer } from './Components/Footer';
import { Header } from './Components/Header';
import { Loader } from './Components/Loader';
import { Filter } from './types/Filter';
import { chooseActіveArray } from './utils/functions';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filteredButton, setFilteredButton] = useState<Filter>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [completedClearing, setCompletedClearing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const completedTodoIds = todos
    .filter(todo => todo.completed)
    .map(todo => todo.id);

  useEffect(() => {
    setIsLoading(true);
    getTodos()
      .then(data => setTodos(data))
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTodos([]);
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      })
      .finally(() => setIsLoading(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMessage={setErrorMessage}
          setTodos={setTodos}
          setTempTodo={setTempTodo}
          inputRef={inputRef}
        />

        {isLoading ? (
          <Loader />
        ) : (
          <TodoList
            todos={chooseActіveArray(filteredButton, todos)}
            tempTodo={tempTodo}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            inputRef={inputRef}
            completedTodoIds={completedTodoIds}
            completedClearing={completedClearing}
          />
        )}

        {todos.length > 0 && (
          <Footer
            todos={todos}
            filteredButton={filteredButton}
            filterBy={setFilteredButton}
            setTodos={setTodos}
            setErrorMessage={setErrorMessage}
            inputRef={inputRef}
            setCompletedClearing={setCompletedClearing}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !errorMessage },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />
        {errorMessage}
        <br />
      </div>
    </div>
  );
};
