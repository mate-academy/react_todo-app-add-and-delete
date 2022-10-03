/* eslint-disable jsx-a11y/control-has-associated-label */
import {
  FC,
  useContext,
  useState,
  useEffect,
  useReducer,
  useMemo,
} from 'react';
// import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

import { getTodos, removeTodos } from './api/todos';
import { Todo } from './types/Todo';
import { SortType } from './types/Filter';
import { NewTodoField } from './components/NewTodoField';

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
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [sortType, setSortType] = useState<SortType>(SortType.All);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [completeItem, dispatch] = useReducer(reducer, 0);

  const increase = () => dispatch('increase');
  const decrease = () => dispatch('decrease');

  // const getUserFromServer = (userId: number) => {

  let userId = 0;

  if (user?.id) {
    userId = user.id;
  }

  useEffect(() => {
    getTodos(userId)
      .then(userTodosFromServer => {
        setTodos(userTodosFromServer);
        reducer(userTodosFromServer.length, ''); // check is this work
      })
      .catch(() => setErrorMessage('Unable to update todos'));
  }, []);

  // useEffect(() => {
  //   if (!user) {
  //     return;
  //   }

  //   getUserFromServer(user.id);
  // }, [user]);

  useEffect(() => {
    todos.map(todo => {
      if (!todo.completed) {
        increase();
      }

      return 0;
    });
  }, [todos]);

  const visibleTodos = useMemo(() => (
    filtTodos(todos, sortType)
  ), [todos, sortType]);

  const addNewTodo = (todo: Todo) => {
    setTodos(prevTodos => [todo, ...prevTodos]);
    increase();
  };

  const deleteTodo = (todoId: number) => {
    removeTodos(todoId)
      .catch(() => setErrorMessage('Unable to delete a todo'));

    setTodos(
      todos.filter(userTodo => todoId !== userTodo.id),
    );
    decrease();
  };

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

          <NewTodoField
            onAdd={addNewTodo}
            setErrorMessage={setErrorMessage}
          />
        </header>

        <TodoList
          todos={visibleTodos}
          removeTodo={deleteTodo}
        />

        <Footer
          sortType={sortType}
          completeItem={completeItem}
          onSortChange={setSortType}
        />
      </div>

      {errorMessage && (
        <ErrorNotification
          errorMessage={errorMessage}
          errorMessageHandler={setErrorMessage}
        />
      )}
    </div>
  );
};
