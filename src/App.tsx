/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/dot-notation */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import classNames from 'classnames';
import { Todo } from './types/Todo';
import * as todosFromServer from './api/todos';
import { wait } from './utils/fetchClient';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoList } from './components/TodoList/TodoList';
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { Status } from './types/Status';
import { TodoItem } from './components/TodoItem/TodoItem';

const getTodosByStatus = (status: string, todos: Todo[]) => {
  const preperedTodos = [...todos];

  if (status) {
    switch (status) {
      case Object.keys(Status)[Object.values(Status).indexOf(Status.active)]:
        return preperedTodos.filter(todo => !todo.completed);
      case Object.keys(Status)[Object.values(Status).indexOf(Status.completed)]:
        return preperedTodos.filter(todo => todo.completed);
      default:
        return preperedTodos;
    }
  }

  return preperedTodos;
};

export const App: React.FC = () => {
  const [titleError, setTitleError] = useState(false);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loadError, setLoadError] = useState(false);
  const [addError, setAddError] = useState(false);
  const [deleteError, setDeleteError] = useState(false);
  const [status, setStatus] = useState('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filteredTodos = getTodosByStatus(status, todos);

  function addTodo(newTodoTitle: string): any {
    const editedTitle = newTodoTitle.trim();

    if (!editedTitle) {
      setTitleError(true);
      wait(3000).then(() => setTitleError(false));

      return;
    } else {
      setTempTodo({
        id: 0,
        userId: 839,
        title: editedTitle,
        completed: false,
      });

      return todosFromServer
        .createTodos({
          userId: 839,
          title: editedTitle,
          completed: false,
        })
        .then(newTodo => {
          setTodos(prevTodos => [...prevTodos, newTodo]);
          setTempTodo(null);
        })
        .catch(() => {
          setAddError(true);
          wait(3000).then(() => setAddError(false));
        });
    }
  }

  function updateTodo(updatedTodo: Todo) {
    todosFromServer.updateTodos(updatedTodo).then((todo: Todo) =>
      setTodos(currentTodos => {
        const newTodos = [...currentTodos];
        const index = newTodos.findIndex(
          thisTodo => thisTodo.id === updatedTodo.id,
        );

        newTodos.splice(index, 1, todo);

        return newTodos;
      }),
    );
  }

  const deleteTodo = (paramTodo: Todo) => {
    todosFromServer
      .deleteTodos(paramTodo.id)
      .then(() =>
        setTodos(prevTodos =>
          prevTodos.filter(todo => todo.id !== paramTodo.id),
        ),
      )
      .catch(() => {
        setDeleteError(true);
        wait(3000).then(() => setDeleteError(false));
      });
  };

  useEffect(() => {
    todosFromServer
      .getTodos()
      .then(setTodos)
      .catch(() => setLoadError(true));
    wait(3000).then(() => setLoadError(false));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const deleteCompletedTodos = (paramTodos: Todo[]) => {
    paramTodos.forEach(todo => deleteTodo(todo));
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* Add a todo on form submit */}
          <TodoForm onSubmit={addTodo} setTitleError={setTitleError} />
        </header>

        <TodoList
          todos={filteredTodos}
          updateTodo={updateTodo}
          deletTodo={deleteTodo}
        />

        {tempTodo !== null && <TodoItem todo={tempTodo} />}

        {!!todos.length && (
          // {/* Hide the footer if there are no todos */}
          <TodoFooter
            todos={todos}
            setStatus={setStatus}
            status={status}
            deleteCompletedTodos={deleteCompletedTodos}
          />
        )}
      </div>

      {/* {error && ( */}
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !titleError && !loadError && !addError && !deleteError },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          // onClick={() => {
          //   setLoadError(false);
          //   setAddError(false);
          //   setTitleError(false);
          //   setDeleteError(false);
          // }}
        />
        {/* show only one message at a time */}
        {loadError && 'Unable to load todos'}
        <br />
        {titleError && 'Title should not be empty'}
        <br />
        {addError && 'Unable to add a todo'}
        <br />
        {deleteError && 'Unable to delete a todo'}
        <br />
        {/* Unable to update a todo */}
      </div>
    </div>
  );
};
