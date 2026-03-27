/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useContext, useMemo } from 'react';
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
import { TodoContext } from './store/TodoContext';
import { ErrorContext } from './store/ErrorContext';
import { TodoItem } from './components/TodoItem/TodoItem';

export const App: React.FC = () => {
  const { isError, errorMessage, showError, closeError } =
    useContext(ErrorContext);
  const { todos, setTodos } = useContext(TodoContext);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filter, setFilter] = useState<Filter>('All');

  // eslint-disable-next-line react-hooks/exhaustive-deps
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

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'Active':
        return todos.filter(item => !item.completed);
      case 'Completed':
        return todos.filter(item => item.completed);
      default:
        return todos;
    }
  }, [todos, filter]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header setTempTodo={setTempTodo} />
        <TodoList todos={filteredTodos} />
        {tempTodo !== null && <TodoItem todo={tempTodo} />}
        {todos.length > 0 && <Footer filter={filter} setFilter={setFilter} />}
      </div>

      <div
        data-cy="ErrorNotification"
        className={classNames(
          'notification is-danger is-light has-text-weight-normal',
          {
            hidden: !isError,
          },
        )}
      >
        <button
          data-cy="HideErrorButton"
          type="button"
          className="delete"
          onClick={closeError}
        />
        {errorMessage}
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
