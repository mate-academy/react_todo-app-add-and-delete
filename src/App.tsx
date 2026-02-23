/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { useState } from 'react';
import { Todo } from './types/Todo';
import { useEffect } from 'react';
import { Header } from './components/Header/Header';
import { TodoList } from './components/TodoList/TodoList';
import { Footer } from './components/Footer/Footer';
import { Filter } from './types/Filters';

import classNames from 'classnames';
import { useError } from './hooks/useError';
import { TodoContext } from './store/TodoContext';
import { ErrorContext } from './store/ErrorContext';

export const App: React.FC = () => {
  const { error, showError, closeError } = useError();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [deletingIds, setDeletingIds] = useState<number[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>('All');

  useEffect(() => {
    const loadTodos = async () => {
      try {
        const response = await getTodos();

        if (!response) {
          throw new Error('Error 404');
        }

        setTodos(response);
      } catch (err) {
        showError('Unable to load todos');
      }
    };

    loadTodos();
  }, []);

  const filteredTodos = () => {
    let copyTodos = [...todos];

    switch (filter) {
      case 'Active':
        copyTodos = copyTodos.filter(item => !item.completed);
        break;
      case 'Completed':
        copyTodos = copyTodos.filter(item => item.completed);
        break;
      default:
        break;
    }

    if (tempTodo !== null) {
      copyTodos = [...copyTodos, tempTodo];
    }

    return copyTodos;
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <TodoContext.Provider
          value={{ todos, setTodos, deletingIds, setDeletingIds }}
        >
          <ErrorContext.Provider value={{ ...error, showError, closeError }}>
            <Header setTempTodo={setTempTodo} />
            <TodoList todos={filteredTodos()} />
            {todos.length > 0 && (
              <Footer filter={filter} setFilter={setFilter} />
            )}
          </ErrorContext.Provider>
        </TodoContext.Provider>
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !error.isError,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closeError}
        />
        {error.errorMessage}
      </div>
    </div>
  );
};

//         {/* This todo is being edited */}
//         <div data-cy="Todo" className="todo">
//           <label className="todo__status-label">
//             <input
//               data-cy="TodoStatus"
//               type="checkbox"
//               className="todo__status"
//             />
//           </label>

//           {/* This form is shown instead of the title and remove button */}
//           <form>
//             <input
//               data-cy="TodoTitleField"
//               type="text"
//               className="todo__title-field"
//               placeholder="Empty todo will be deleted"
//               value="Todo is being edited now"
//             />
//           </form>

//           <div data-cy="TodoLoader" className="modal overlay">
//             <div className="modal-background has-background-white-ter" />
//             <div className="loader" />
//           </div>
//         </div>

//       Unable to load todos
//       Title should not be empty
//       Unable to add a todo
//       Unable to delete a todo
//       Unable to update a todo
