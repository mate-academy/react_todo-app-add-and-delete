/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState, useEffect, useMemo, useRef,
} from 'react';
import { UserWarning } from './UserWarning';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Footer } from './components/Footer';
import { Todo } from './types/Todo';
import { getTodos } from './api/todos';

const USER_ID = 11359;

enum QueryTodos {
  all = 'All',
  active = 'Active',
  completed = 'Completed',
}

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMassege, setErrorMassege] = useState('');
  const [query, setQuery] = useState<string>(QueryTodos.all);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSpinner, setIsSpinner] = useState(false);
  const [cuurentId, setCurrentId] = useState(0);
  const [date, setDate] = useState(new Date());

  const timerId = useRef(0);

  const hideError = () => {
    timerId.current = window.setTimeout(() => setErrorMassege(''), 3000);
  };

  useEffect(() => {
    getTodos(USER_ID)
      .then((myTodos) => {
        setTodos(myTodos);
      })
      .catch(() => {
        setErrorMassege('unable to load todos');
        hideError();
      });

    return () => window.clearTimeout(timerId.current);
  }, [date]);

  const isCompletedTodo = () => {
    return todos.some(todo => todo.completed);
  };

  if (isCompletedTodo()) {
    setIsCompleted(true);
  }

  const getNumberActiveTodos = (items: Todo[]) => {
    const activeTodos = items.filter(todo => !todo.completed);

    return activeTodos.length;
  };

  const numberOfActive = useMemo(() => {
    return getNumberActiveTodos(todos);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filterTodos = (param: string) => {
    switch (param) {
      case QueryTodos.active: {
        return todos.filter(todo => !todo.completed);
      }

      case QueryTodos.completed: {
        return todos.filter(todo => todo.completed);
      }

      default:
        return todos;
    }
  };

  const removeTodoFromList = (todoId: number) => {
    setTodos(currentTodos => {
      const deletedTodo = currentTodos.find(todo => todo.id === todoId);
      let index: number;

      if (deletedTodo) {
        index = currentTodos.indexOf(deletedTodo);
        currentTodos.splice(index, 1);
      }

      return [...currentTodos];
    });
  };

  const addNewTodoToList = (newTodo: Todo) => {
    setTodos(currentTodos => {
      return [...currentTodos, newTodo];
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          setErrorMassege={setErrorMassege}
          hideError={() => hideError()}
          userId={USER_ID}
          addTodo={(newTodo) => addNewTodoToList(newTodo)}
          spinnerStatus={setIsSpinner}
          changeDate={setDate}
          changeCurrentId={setCurrentId}
          setTodos={setTodos}
          todos={todos}
        />
        <Main
          todos={filterTodos(query)}
          removeTodo={(todoId: number) => removeTodoFromList(todoId)}
          setErrorMassege={setErrorMassege}
          hideError={() => hideError()}
          spinner={isSpinner}
          spinnerStatus={setIsSpinner}
          cuurentId={cuurentId}
          changeCurrentId={setCurrentId}
        />

        {!!todos.length && (
          <Footer
            changeQuery={setQuery}
            isCompleted={isCompleted}
            numberActive={numberOfActive}
            status={query}
          />
        )}
      </div>

      {errorMassege && (
        <div
          className={`notification is-danger
                   is-light
                   has-text-weight-normal
                   ${!errorMassege && 'hidden'}`}
        >
          <button
            onClick={() => setErrorMassege('')}
            type="button"
            className="delete"
          />

          {/* show only one message at a time */}
          {errorMassege}
        </div>
      )}
    </div>
  );
};
