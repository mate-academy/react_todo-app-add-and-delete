/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useContext,
  useState,
  useEffect,
  useReducer,
  useMemo,
  useRef,
} from 'react';
// import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { SortType } from './types/Filter';

function filtTodos(
  todos: Todo[],
  sortType: SortType,
) {
  const visibleTodos = [...todos];

  switch (sortType) {
    case SortType.Active:
      return visibleTodos.filter(todo => !todo.completed);

    case SortType.Completed:
      return visibleTodos.filter(todo => todo.completed);
    default:
      return visibleTodos;
  }
}

const reducer = (count: number, action: string) => {
  switch (action) {
    case 'increase':
      return count + 1;
    case 'decrease':
      return count - 1;
    case 'clear':
      return 0;
    default:
      return count;
  }
};

export const App: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [sortType, setSortType] = useState<SortType>(SortType.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completeItem, dispatch] = useReducer(reducer, 0);

  const increase = () => dispatch('increase');

  const getUserFromServer = (userId: number) => {
    getTodos(userId)
      .then(userTodosFromServer => setTodos(userTodosFromServer))
      .catch(() => setErrorMessage('Unable to update todos'));
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    getUserFromServer(user.id);
  }, [user]);

  useEffect(() => {
    todos.map(todo => {
      if (!todo.completed) {
        increase();
      }

      return 0;
    });
  }, [todos]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const visibleTodos = useMemo(() => (
    filtTodos(todos, sortType)
  ), [todos, sortType]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            data-cy="ToggleAllButton"
            type="button"
            className="todoapp__toggle-all active"
          />

          <form>
            <input
              data-cy="NewTodoField"
              type="text"
              ref={newTodoField}
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
            />
          </form>
        </header>

        <TodoList todos={visibleTodos} />
        <Footer
          sortType={sortType}
          completeItem={completeItem}
          onSortChange={setSortType}
        />
      </div>

      {errorMessage && (
        <ErrorNotification errorMessage={errorMessage} />
      )}
    </div>
  );
};
