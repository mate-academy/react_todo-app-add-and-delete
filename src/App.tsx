/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useMemo,
} from 'react';

import { AuthContext } from './components/Auth/AuthContext';

import { TodoHeader } from './components/TodoHeader';
import { TodoList } from './components/TodoList';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { filterTodos, Filter } from './helpers/filterTodos';

import { Todo } from './types/Todo';
import { getTodos } from './api/todos';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filterOption, setFilterOption] = useState<Filter>(Filter.all);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const handleError = () => {
    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          setErrorMessage('Unable to load a todos');
          handleError();
        });
    }
  }, []);

  const activeTodosCount = useMemo(
    () => todos.filter(todo => !todo.completed).length,
    [todos],
  );

  const completeTodosCount = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const filteredTodos = useMemo(() => {
    return filterTodos(todos, filterOption);
  }, [todos, filterOption]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <TodoHeader newTodoField={newTodoField} />

        {todos.length > 0 && (
          <>
            <TodoList todos={filteredTodos} />

            <TodoFooter
              activeTodos={activeTodosCount}
              completeTodosCount={completeTodosCount}
              filterOption={filterOption}
              onChangeFilterType={setFilterOption}
            />
          </>
        )}
      </div>

      {errorMessage && (
        <ErrorNotification
          error={errorMessage}
          onChangeError={setErrorMessage}
        />
      )}
    </div>
  );
};
