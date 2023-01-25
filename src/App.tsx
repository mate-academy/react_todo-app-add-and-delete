import React, {
  useContext, useEffect, useMemo, useRef, useState,
} from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { FilterType } from './types/FilterTypes';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [sortType, setSortType] = useState<FilterType>(FilterType.ALL);
  const [errorText, setErrorText] = useState('');

  const showErrorBanner = (errorMsg: string) => {
    setErrorText(errorMsg);
    setTimeout(() => setErrorText(''), 3000);
  };

  useEffect(() => {
    if (user) {
      getTodos(user.id)
        .then(setTodos).catch(() => showErrorBanner('Cant load user todos'));
    }

    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const filteredTodos: Todo[] = useMemo(() => todos.filter(todo => {
    if (sortType === 'active') {
      return !todo.completed;
    }

    if (sortType === 'completed') {
      return todo.completed;
    }

    return true;
  }), [todos, sortType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header newTodoField={newTodoField} todos={todos} />

        { filteredTodos.length || sortType !== 'all'
          ? (
            <>
              <TodoList todos={filteredTodos} />

              <Footer
                todos={filteredTodos}
                sortType={sortType}
                setSortType={setSortType}
              />
            </>
          )
          : null}
      </div>
      {errorText
        ? (
          <ErrorNotification
            errorText={errorText}
            setErrorText={setErrorText}
          />
        )
        : null }
    </div>
  );
};
