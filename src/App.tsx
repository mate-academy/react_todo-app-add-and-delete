/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getTodos } from './api/todos';
import { AuthContext } from './components/Auth/AuthContext';
import { Footer } from './components/Page/Footer';
import { TodoList } from './components/Page/TodoList';
import { TodoContext } from './components/TodoContext';
import { FilterType } from './types/FilterTypeEnum';

export const App: React.FC = () => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todos, setTodos] = useContext(TodoContext);
  const [filterType, setFilterType] = useState<FilterType>(FilterType.All);

  const loadTodos = (userId: number) => {
    getTodos(userId)
      .then(todosFromServer => {
        setTodos(todosFromServer);
        // eslint-disable-next-line no-console
        console.log(todosFromServer);
      })
      .catch(() => { });
  };

  useEffect(() => {
    if (!user) {
      return;
    }

    loadTodos(user.id);
  }, [user]);

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  const visibleTodos = filterType === FilterType.All
    ? todos
    : todos.filter(({ completed }) => {
      switch (filterType) {
        case FilterType.Active:
          return !completed;
        case FilterType.Completed:
          return completed;

        default:
          throw new Error();
      }
    });

  const handleChooseFilter = useCallback(
    (filter: FilterType) => {
      setFilterType(filter);
    },
    [filterType],
  );

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

        <TodoList visibleTodos={visibleTodos} />

        <Footer
          handleChooseFilter={handleChooseFilter}
          todos={visibleTodos}
          filterType={filterType}
        />
      </div>

      {/* I'm will created this component in next task */}
      {/* <div
        data-cy="ErrorNotification"
        className="notification is-danger is-light has-text-weight-normal"
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
        />

        Unable to add a todo
        <br />
        Unable to delete a todo
        <br />
        Unable to update a todo
      </div> */}
    </div>
  );
};
