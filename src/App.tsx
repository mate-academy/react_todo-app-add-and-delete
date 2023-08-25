/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useEffect,
  useMemo,
  useContext,
} from 'react';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { TodoForm } from './components/TodoForm';
import { TodoList } from './components/TodoList';
import { TodosFilter } from './components/TodosFilter';
import * as todoService from './api/todos';
import { Notification } from './components/Notification';
import { UserWarning } from './UserWarning';
import { TodosContext } from './TodosContext';
import { USER_ID } from './utils/constants';
import { Error } from './types/Error';

export const App: React.FC = () => {
  const {
    todos,
    setTodos,
    errorMessage,
    setErrorMessage,
    setToBeCleared,
  } = useContext(TodosContext);

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => {
        setErrorMessage(Error.Load);
      });
  }, []);

  const [completed, active]: number[] = useMemo(() => {
    const complete = todos.filter(todo => todo.completed).length;

    return [
      complete,
      todos.length - complete,
    ];
  }, [todos]);

  const handleClear = () => {
    setToBeCleared(todos
      .filter(todo => todo.completed)
      .map(todo => todo.id));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">

          {!!active && (
            <button type="button" className="todoapp__toggle-all active" />
          )}

          <TodoForm />

        </header>

        {todos.length > 0 && (
          <>
            <section className="todoapp__main">
              <TodoList />
            </section>

            <footer className="todoapp__footer">
              <span className="todo-count">
                {`${active} items left`}
              </span>

              <TodosFilter />

              {!!completed && (
                <button
                  type="button"
                  className="todoapp__clear-completed"
                  onClick={handleClear}
                >
                  Clear completed
                </button>
              )}
            </footer>
          </>
        )}
      </div>

      <TransitionGroup>
        {!!errorMessage && (
          <CSSTransition
            timeout={500}
            classNames="error"
          >
            <Notification />
          </CSSTransition>
        )}
      </TransitionGroup>
    </div>
  );
};
