/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { Todo } from './types/Todo';
import * as todoService from './api/todos';
import { TodoList } from './components/TodoList';
import { TodoFilter } from './components/TodoFilter';
import { filterTodos } from './helper';
import { Status } from './types/Status';
import { Header } from './components/Header/Header';
import { Error } from './types/Error';

const USER_ID = 12051;

export const App: React.FC = () => {
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<Status>(Status.All);

  const showError = (message: string) => {
    setErrorMessage(message);
    setTimeout(() => setErrorMessage(null), 3000);
  };

  const deleteTodo = async (id: number) => {
    try {
      await todoService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch {
      showError(Error.NotDelete);
    }
  };

  const addTodo = (titleTodo: string): Promise<void> => {
    setTempTodo({
      title: titleTodo,
      id: 0,
      userId: USER_ID,
      completed: false,
    });

    return todoService.addTodo({
      title: titleTodo,
      userId: USER_ID,
      completed: false,
    }).then(newTodo => setTodos(currentTodos => [...currentTodos, newTodo]))
      .catch(() => showError(Error.NotAdd))
      .finally(() => setTempTodo(null));
  };

  useEffect(() => {
    todoService.getTodos(USER_ID)
      .then(setTodos)
      .catch(() => showError(Error.NotLoad));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const filteredTodos = filterTodos(todos, filterStatus);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <div className="todoapp__content">
        <Header addTodo={addTodo} showError={showError} />
        <TodoList
          deleteTodo={deleteTodo}
          todos={filteredTodos}
          tempTodo={tempTodo}
        />

        {todos.length > 0 && (
          <footer className="todoapp__footer" data-cy="Footer">
            <span className="todo-count" data-cy="TodosCounter">
              {`${filteredTodos.length} items left`}
            </span>

            <TodoFilter
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
            />

            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
            >
              Clear completed
            </button>
          </footer>
        )}

      </div>
      {errorMessage && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button data-cy="HideErrorButton" type="button" className="delete" />
          {errorMessage}
        </div>
      )}
    </div>
  );
};
