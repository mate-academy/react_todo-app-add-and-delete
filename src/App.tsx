/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Todos } from './components/Todos';
import { Todo } from './types/Todo';
import { TodoFilter } from './utils/filterTodos/TodoFilter';
import { TodoFilterStatus } from './types/TodoFilterStatus';
import cn from 'classnames';

enum TypeError {
  None = '',
  UnableLoadTodos = 'unableLoadTodos',
  UnableAddTodo = 'unableAddTodo',
  UnableDeleteTodo = 'unableDeleteTodo',
  UnableUpdateTodo = 'unableUpdateTodo',
  TitleEmpty = 'titleEmpty',
}

export const App: React.FC = () => {
  const refQuery = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<TypeError>(TypeError.None);
  const [todoFilterState, setTodoFilterState] = useState<TodoFilterStatus>(
    TodoFilterStatus.All,
  );

  const filtredTodo = TodoFilter.Filter(
    todos,
    TodoFilter.FilterByComplit(todoFilterState),
  );

  // #region HeaderHandels

  const handelOnSummit = () => {
    return;
  };

  const handelOnToggleAllTodo = () => {
    return;
  };

  //#endregion

  // #region FooterHandels

  const handelSetTodoFilter = (FilterStatus: TodoFilterStatus) => {
    setTodoFilterState(FilterStatus);
  };

  const handelDeleteCompletedTodos = () => {
    return;
  };

  // #endregion

  //#region useEffect

  useEffect(() => {
    new Promise(resolve => {
      setTimeout(resolve, 1000);
    }).then(() => setError(TypeError.None));
  }, [error]);

  useEffect(() => {
    getTodos(USER_ID)
      .then(newTodos => {
        setTodos(newTodos);
      })
      .catch(() => {
        setError(TypeError.UnableLoadTodos);
      });
  }, []);

  // #endregion

  function getComplitedTodo() {
    return todos.reduce((prec, todo) => (todo.completed ? prec + 1 : prec), 0);
  }

  function getErrorMesseg() {
    switch (error) {
      case TypeError.TitleEmpty:
        return 'Title should not be empty';
      case TypeError.UnableAddTodo:
        return 'Unable to add a todo';
      case TypeError.UnableDeleteTodo:
        return 'Unable to delete a todo';
      case TypeError.UnableLoadTodos:
        return 'Unable to load todos';
      case TypeError.UnableUpdateTodo:
        return 'Unable to update a todo';
      default:
        return '';
    }
  }

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          refQuery={refQuery}
          isAllTodoDone={true}
          onSubmitTodo={handelOnSummit}
          onToggleAllTodo={handelOnToggleAllTodo}
        />

        <Todos
          todos={filtredTodo}
          onCompletedMarkClik={() => {}}
          onDeleteClik={() => {}}
          onEditClik={() => {}}
        />

        <Footer
          totalTodos={todos.length}
          complitedTodos={getComplitedTodo()}
          selectedFilter={todoFilterState}
          setTodoFilter={handelSetTodoFilter}
          deleteCompletedTodos={handelDeleteCompletedTodos}
        />
      </div>

      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification',
          'is-danger',
          'is-light',
          'has-text-weight-normal',
          { hidden: error === TypeError.None },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {getErrorMesseg()}
      </div>
    </div>
  );
};
