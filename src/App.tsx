import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification }
  from './components/ErrorNotification/ErrorNotification';
import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { FilterType } from './types/FilterType';
import { Todo } from './types/Todo';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [selectedFilter, selectFilter] = useState(FilterType.All);
  const [errorMessage, setErrorMessage] = useState('');

  const showError = useCallback((message: string) => {
    setErrorMessage(message);

    setTimeout(() => setErrorMessage(''), 3000);
  }, []);

  const closeErroreMessage = useCallback(() => {
    setErrorMessage('');
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    if (user) {
      getTodos(user.id)
        .then(setTodos)
        .catch(() => showError('Unable to load a todos'));
    }
  }, [user]);

  const visibleFiltredTodos = useMemo(() => {
    switch (selectedFilter) {
      case FilterType.Active:
        return todos.filter(todo => (
          !todo.completed
        ));

      case FilterType.Completed:
        return todos.filter(todo => (
          todo.completed
        ));

      default:
        return todos;
    }
  }, [selectedFilter, todos]);

  const ActiveTodosCount = useMemo(() => (
    todos.filter(todo => !todo.completed)).length, [todos]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          newTodoField={newTodoField}
          showError={showError}
        />

        {todos.length > 0
          && (
            <>
              <TodoList todos={visibleFiltredTodos} />
              <Footer
                activeTodosCount={ActiveTodosCount}
                selectedFilter={selectedFilter}
                selectFilter={selectFilter}
              />
            </>
          )}
      </div>

      {
        errorMessage && (
          <ErrorNotification
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            close={closeErroreMessage}
          />
        )
      }
    </div>
  );
};
