/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useState,
  useContext,
  useEffect,
  useRef,
  useCallback,
} from 'react';

import { AuthContext } from '../Auth/AuthContext';
import { Todo } from '../../types/Todo';
import * as Api from './api/todos';
import { FilterBy } from '../../types/FilterBy';
import { TodoList } from '../TodoList';
import { Footer } from '../Footer';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todoList, setTodoList] = useState<Todo[] | null>(null);
  const [showFooter, setShowFooter] = useState(false);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [error, setError] = useState('');

  const [todoTitle, setTodoTitle] = useState('');
  const [loadingInput, setLoadingInput] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const getTodosFromServer = useCallback(
    () => {
      if (user) {
        Api.getTodos(user.id)
          .then((data) => {
            setTodoList(data);

            if (data.length) {
              setShowFooter(true);
            }
          })
          .catch(() => {
            setError('Error 404 unable to get todos');
            setTimeout(() => setError(''), 3000);
          })
          .finally(() => {
            setTempTodo(null);
            setIsDeleting(false);
          });
      }
    },
    [],
  );

  const addTodoToServer = () => {
    if (user && todoTitle.length) {
      // we disable the input while trying to post the todo.
      setLoadingInput(true);
      setTodoTitle('');

      Api.addTodo(todoTitle, user.id)
        .then(() => {
          setTempTodo({
            id: 0,
            userId: user.id,
            title: todoTitle,
            completed: false,
          });

          getTodosFromServer();
        })
        .catch(() => {
          setError('Unable to add a todo');
          setTimeout(() => setError(''), 3000);
        })
        .finally(() => {
          setLoadingInput(false);
        });
    }
  };

  const removeTodoFromServer = useCallback(
    (todoId: number) => {
      setIsDeleting(true);

      Api.removeTodo(todoId)
        .then(() => {
          getTodosFromServer();
        })
        .catch(() => {
          setError('Unable to delete a todo');
          setTimeout(() => setError(''), 3000);
        })
        .finally(() => {});
    },
    [],
  );

  useEffect(() => {
    // focus the element with `ref={newTodoField}`
    if (newTodoField.current) {
      newTodoField.current.focus();
    }

    getTodosFromServer();
  }, []);

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
              disabled={loadingInput}
              value={todoTitle}
              onChange={(event) => {
                setTodoTitle(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();

                  addTodoToServer();
                }
              }}
            />
          </form>
        </header>

        {todoList && (
          <TodoList
            todoList={todoList}
            filterBy={filterBy}
            tempTodo={tempTodo}
            onRemove={removeTodoFromServer}
            isDeleting={isDeleting}
          />
        )}

        {showFooter && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
            todosLength={todoList?.length}
          />
        )}
      </div>

      {error && (
        <div
          data-cy="ErrorNotification"
          className="notification is-danger is-light has-text-weight-normal"
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setError('')}
          />
          {error}
        </div>
      )}
    </div>
  );
};
