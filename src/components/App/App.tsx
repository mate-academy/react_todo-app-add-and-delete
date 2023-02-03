/* eslint-disable no-console */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { AuthContext } from '../Auth/AuthContext';
import { Todo } from '../../types/Todo';
import * as Api from '../../api/todos';
import { TodoList } from '../TodoList';
import { FilterBy } from '../../types/filterBy';
import { Footer } from '../Footer';

export const App: React.FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [todoList, setTodoList] = useState<Todo[] | null>(null);
  const [showFooter, setShowFooter] = useState(false);
  const [error, setError] = useState('');
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [todoTitle, setTodoTitle] = useState('');
  const [loadingInput, setLoadingInput] = useState(false);
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
          });

        // setTempTodo(null);
        // console.log('1')
      }
    },
    [],
  );

  const addTodoToServer = () => {
    if (user && todoTitle.length) {
      // we disable the input while trying to post the todo.
      setLoadingInput(true);

      const newTodo = {
        userId: user.id,
        title: todoTitle,
        completed: false,
      };

      setTodoTitle('');

      Api.addTodo(newTodo)
        .then(response => {
          setTempTodo({
            id: 0,
            userId: user.id,
            title: todoTitle,
            completed: false,
          });

          console.log(response);
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
      Api.removeTodo(todoId);
      getTodosFromServer();
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

  // useEffect(() => {
  //   if (user) {
  //     Api.getTodos(user.id)
  //       .then((data) => {
  //         setTodoList(data);

  //         if (data.length) {
  //           setShowFooter(true);
  //         }
  //       })
  //       .catch(() => {
  //         setError('Error 404 unable to get todos');
  //         setTimeout(() => setError(''), 3000);
  //       });
  //   }
  // }, [tempTodo]);

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
              onChange={(e) => {
                setTodoTitle(e.target.value);
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
            onRemove={removeTodoFromServer}
            tempTodo={tempTodo}
            todoList={todoList}
            filterBy={filterBy}
          />
        )}

        {showFooter && (
          <Footer
            filterBy={filterBy}
            setFilterBy={setFilterBy}
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
          {/* Unable to add a todo
          <br />
          Unable to delete a todo
          <br />
          Unable to update a todo */}
        </div>
      )}
    </div>
  );
};
