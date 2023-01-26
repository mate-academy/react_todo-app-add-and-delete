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
  const [tempNewTodo, setTempNewTodo] = useState<Todo | null>(null);

  const showErrorBanner = (errorMsg: string) => {
    setErrorText(errorMsg);
    setTimeout(() => setErrorText(''), 3000);
  };

  const loadTodos = () => {
    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => showErrorBanner('Cant load user todos'));
    }
  };

  const removeTodo = (todoId: number) => setTodos(
    todos.filter(todo => todo.id !== todoId),
  );

  const removeTodos = (todoIds: number[]) => setTodos(
    todos.filter(todo => !todoIds.includes(todo.id)),
  );

  useEffect(() => {
    loadTodos();
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
        <Header
          newTodoField={newTodoField}
          todos={todos}
          showErrorBanner={showErrorBanner}
          user={user}
          setTempNewTodo={setTempNewTodo}
          setTodos={setTodos}
        />

        { filteredTodos.length || sortType !== 'all'
          ? (
            <>
              <TodoList
                todos={filteredTodos}
                tempNewTodo={tempNewTodo}
                showErrorBanner={showErrorBanner}
                removeTodo={removeTodo}
              />

              <Footer
                todos={filteredTodos}
                sortType={sortType}
                setSortType={setSortType}
                removeTodos={removeTodos}
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
