/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { AuthContext } from './components/Auth/AuthContext';
import { getTodos } from './api/todos';
import { Todo } from './types/Todo';
import { Error } from './components/Error';
import { Filter } from './types/Filter';
import { Header } from './components/Header';
import { TodoList } from './components/TodoList';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filterBy, setFilterBy] = useState(Filter.ALL);
  const [titleError, setTitleError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [todosToRemove, setTodosToRemove] = useState<number[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);

  const getTodosFromServer = async () => {
    if (user) {
      try {
        const todosFromServer = await getTodos(user.id);

        setTodos(todosFromServer);
      } catch {
        setHasLoadingError(true);
        setErrorMessage('Error... Can not load your todos');
      }
    }
  };

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

  const completedTodosId = todos.filter(todo => todo.completed === true)
    .map(todo => todo.id);

  const activeTodos = todos.filter(todo => todo.completed === false);

  let visibleTodos = todos;

  switch (filterBy) {
    case Filter.COMPLETED:
      visibleTodos = todos.filter(todo => todo.completed === true);
      break;

    case Filter.ACTIVE:
      visibleTodos = todos.filter(todo => todo.completed === false);
      break;

    default: visibleTodos = todos;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      {errorMessage
        ? (
          <Error
            clearErrorMessage={() => setHasLoadingError(false)}
            hasLoadingError={hasLoadingError}
            errorMessage={errorMessage}
          />
        )
        : (
          <div className="todoapp__content">
            <Header
              user={user}
              title={title}
              changeTitle={(value) => setTitle(value)}
              newTodoField={newTodoField}
              onSetTodo={(newTodo) => setTodos(
                (prevTodos) => [...prevTodos, newTodo],
              )}
              onSetTitleError={(isError) => setTitleError(isError)}
              onSetIsAdding={(isLoading) => setIsAdding(isLoading)}
              isAdding={isAdding}
            />

            <TodoList
              visibleTodos={visibleTodos}
              loadTodos={getTodosFromServer}
              isAdding={isAdding}
              title={title}
              user={user}
              todosToRemove={todosToRemove}
              onSetTodosToRemove={(idToRemove) => setTodosToRemove(
                prevIds => [...prevIds, idToRemove],
              )}
            />

            <Footer
              activeTodos={activeTodos}
              filterBy={filterBy}
              selectFilterField={(filter) => setFilterBy(filter)}
              completedTodosId={completedTodosId}
              onSetTodosToRemove={(idToRemove) => setTodosToRemove(
                prevIds => [...prevIds, idToRemove],
              )}
              loadTodos={getTodosFromServer}
            />
          </div>
        )}

      <>
        <br />
        <div
          className={classNames(
            'notification', 'is-danger', 'is-light',
            'has-text-weight-normal', {
              hidden: !titleError,
            },
          )}
        >
          <span>Title can&apos;t be empty</span>
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setTitleError(false)}
          />
        </div>
      </>
    </div>
  );
};
