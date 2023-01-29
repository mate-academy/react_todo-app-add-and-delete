/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import cn from 'classnames';

import { AuthContext } from './components/Auth/AuthContext';
import { NewTodos } from './components/NewTodos';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { todoApi } from './api/todos';
import { Todo } from './types/Todo';
import { FilterType } from './types/FilerType';
import { getFilterTodos } from './components/helpers/helpers';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [
    filterType,
    setFilterType,
  ] = useState<FilterType>(FilterType.All);
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const showErrorMessage = (message: string) => {
    setErrorMessage(message);

    setTimeout(() => setErrorMessage(''), 3000);
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      todoApi.getTodos(user.id)
        .then(setTodos)
        .catch(() => {
          showErrorMessage('Can\'t load todos!');
        });
    }
  }, [showErrorMessage]);

  const onAddTodo = useCallback(async (fieldsForCreate: Omit<Todo, 'id'>) => {
    setIsAddingTodo(true);

    try {
      const newTodo = await todoApi.addTodo(fieldsForCreate);

      setTodos(prev => [...prev, newTodo]);
    } catch {
      showErrorMessage('Unable to add a todo');
    } finally {
      setIsAddingTodo(false);
    }
  }, [showErrorMessage]);

  const incompleteTodos = useMemo(
    () => todos.filter(todo => !todo.completed),
    [todos],
  );

  const amountOfCompletedTodos = useMemo(
    () => todos.filter(todo => todo.completed).length,
    [todos],
  );

  const filterTodos = useMemo(() => {
    return getFilterTodos(todos, filterType);
  }, [todos, filterType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">

        <NewTodos
          newTodoField={newTodoField}
          showErrorMessage={showErrorMessage}
          isAddingTodo={isAddingTodo}
          onAddTodo={onAddTodo}
          userId={user?.id}
        />

        {todos.length > 0 && (
          <>
            <TodoList todos={filterTodos} />

            <Footer
              incompleteTodos={incompleteTodos}
              amountOfCompletedTodos={amountOfCompletedTodos}
              filterType={filterType}
              setFilterType={setFilterType}
            />
          </>
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn('notification is-danger is-light has-text-weight-normal',
          {
            hidden: !errorMessage,
          })}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={() => setErrorMessage('')}
        />

        {errorMessage}

      </div>
    </div>
  );
};
