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
  const [status, setStatus] = useState('all');
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const filteredTodos = getTodosByStatus(status, todos);

  const addTodo = (newTodoTitle: string) => {
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
      todosFromServer
        .createTodos({
          userId: 839,
          title: editedTitle,
          completed: false,
        })
        .then(newTodo => {
          setTodos(prevTodos => [...prevTodos, newTodo]);
          setTempTodo(null);
        })
        .catch(error => {
          setLoadError(true);
          throw error;
        });
    }
  };

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

  const handleDeleteTodo = (paramTodo: Todo) => {
    todosFromServer.deleteTodos(paramTodo.id);
    setTodos(prevTodos => prevTodos.filter(todo => todo.id !== paramTodo.id));
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

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* Add a todo on form submit */}
          <TodoForm onSubmit={addTodo} />
        </header>

        <TodoList
          todos={filteredTodos}
          updateTodo={updateTodo}
          deletTodo={handleDeleteTodo}
        />

        {tempTodo !== null && <TodoItem todo={tempTodo} />}

        {!!todos.length && (
          // {/* Hide the footer if there are no todos */}
          <TodoFooter todos={todos} setStatus={setStatus} status={status} />
        )}
      </div>

      {/* {error && ( */}
      {/* DON'T use conditional rendering to hide the notification */}
      {/* Add the 'hidden' class to hide the message smoothly */}
      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !titleError && !loadError },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {/* show only one message at a time */}
        {loadError && 'Unable to load todos'}
        <br />
        {titleError && 'Title should not be empty'}
        <br />
        {/* Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
      </div>
    </div>
  );
};
