/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';

import { UserWarning } from './UserWarning';

import { deleteTodo, getTodos, postTodo, USER_ID } from './api/todos';

import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Todos } from './components/Todos';

import { Todo } from './types/Todo';
import { TodoFilterStatus } from './types/TodoFilterStatus';
import { TypeError } from './types/TypeError';

import { TodoFilter } from './utils/filterTodos/TodoFilter';
import { ErrorNotification } from './components/ErrorNotification';

export const App: React.FC = () => {
  const refQuery = useRef<HTMLInputElement>(null);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [creatingTodo, setCreatingTodo] = useState<Todo | null>(null);
  const [deletingTodos, setDiletingTodos] = useState<number[]>([]);
  const [error, setError] = useState<TypeError>(TypeError.None);
  const [todoFilterState, setTodoFilterState] = useState<TodoFilterStatus>(
    TodoFilterStatus.All,
  );

  const filtredTodo = TodoFilter.Filter(
    todos,
    TodoFilter.FilterByComplit(todoFilterState),
  );

  //#region supportFunctions
  function getComplitedTodo() {
    return todos.reduce((prec, todo) => (todo.completed ? prec + 1 : prec), 0);
  }

  function closeErrorMesseg() {
    setTimeout(() => setError(TypeError.None), 3000);
  }

  //#endregion

  // #region HeaderHandels

  const handelOnSummit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const newTitle = refQuery.current?.value.trim() || '';

    if (newTitle.length > 0) {
      const newTodo = { userId: USER_ID, title: newTitle, completed: false };

      postTodo(newTodo)
        .then(createdtodo => {
          setTodos([...todos, createdtodo]);
          if (refQuery.current) {
            refQuery.current.value = '';
          }
        })
        .catch(() => {
          setError(TypeError.UnableAddTodo);
        })
        .finally(() => {
          setCreatingTodo(null);
          closeErrorMesseg();
        });

      setCreatingTodo({ ...newTodo, id: 0 });
    } else {
      setError(TypeError.TitleEmpty);
      closeErrorMesseg();
    }
  };

  const handelOnToggleAllTodo = () => {
    return;
  };

  //#endregion

  //#region TodosHandels

  const handelOnCompletedMarkClik = () => {};

  const handelOnDeleteClik = (id: number) => {
    setDiletingTodos([...deletingTodos, id]);

    deleteTodo(id)
      .then(() => {
        const idexToDelete = todos.findIndex(todo => todo.id === id);

        setTodos([
          ...todos.slice(0, idexToDelete),
          ...todos.slice(idexToDelete + 1, todos.length),
        ]);
      })
      .catch(() => {
        setError(TypeError.UnableDeleteTodo);
      })
      .finally(() => {
        setTimeout(() => setError(TypeError.None), 3000);
        setDiletingTodos(deletingTodos.filter(deletingId => deletingId !== id));
      });
  };

  const handelOnEditClik = () => {};

  const handelDelaitingAnimations = (id: number) =>
    !!deletingTodos.includes(id);

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
    getTodos(USER_ID)
      .then(newTodos => {
        setTodos(newTodos);
      })
      .catch(() => {
        setError(TypeError.UnableLoadTodos);
      })
      .finally(closeErrorMesseg);
  }, []);

  useEffect(() => {
    refQuery.current?.focus();
  }, [creatingTodo]);
  // #endregion

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
          isCreatingTodo={!!creatingTodo}
          onSubmitTodo={handelOnSummit}
          onToggleAllTodo={handelOnToggleAllTodo}
        />

        <Todos
          todos={filtredTodo}
          creatingTodo={creatingTodo}
          isDeleting={handelDelaitingAnimations}
          onCompletedMarkClik={handelOnCompletedMarkClik}
          onDeleteClik={handelOnDeleteClik}
          onEditClik={handelOnEditClik}
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
      <ErrorNotification errorType={error} />
    </div>
  );
};
