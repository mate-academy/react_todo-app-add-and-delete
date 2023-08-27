import React from 'react';
import classNames from 'classnames';
import { ListAction } from '../Enum/ListAction';
import { useTodo } from '../Hooks/UseTodo';
import { ErrorMessage } from '../Enum/ErrorMessage';
import { deleteTodos, getTodos } from '../api/todos';
import { USER_ID } from '../variables/userId';

type Props = {
  setProcessings: React.Dispatch<React.SetStateAction<number[]>>
  setErrorVisibility: React.Dispatch<React.SetStateAction<boolean>>;
};

export const TodosFooter: React.FC<Props> = ({
  setProcessings,
  setErrorVisibility,
}) => {
  const {
    todos,
    filter,
    setFilter,
    setLoading,
    setIsError,
    setTodos,
  } = useTodo();
  const selectedTodos = todos.filter(todo => !todo.completed);
  const compleatedTodosLength = todos.filter(todo => todo.completed).length;

  const deleteTodo = (postId: number) => {
    setLoading(true);
    const completed = todos.filter(todo => todo.completed).map(todo => todo.id);

    setProcessings(completed);

    deleteTodos(postId)
      .then(() => {
        getTodos(USER_ID)
          .catch(() => {
            setIsError(ErrorMessage.DELETE);
            setErrorVisibility(true);
          })
          .finally(() => {
            setLoading(false);
            setTodos(todos.filter(todo => !todo.completed));
          });
      });
  };

  const handleDeleteCompleted = () => {
    todos.filter(todo => {
      if (todo.completed) {
        deleteTodo(todo.id);
      }

      return todo;
    });
  };

  return (
    <>
      {todos.length > 0 && (
        <footer className="todoapp__footer">
          <span className="todo-count">
            {selectedTodos.length === 1
              ? '1 item left'
              : `${selectedTodos.length} items left`}
          </span>

          <nav className="filter">
            <a
              href="#/"
              className={classNames(
                'filter__link',
                { selected: filter === ListAction.ALL },
              )}
              onClick={() => setFilter(ListAction.ALL)}
            >
              All
            </a>

            <a
              href="#/active"
              className={classNames(
                'filter__link',
                { selected: filter === ListAction.ACTIVE },
              )}
              onClick={() => setFilter(ListAction.ACTIVE)}
            >
              Active
            </a>

            <a
              href="#/completed"
              className={classNames(
                'filter__link',
                { selected: filter === ListAction.COMPLETED },
              )}
              onClick={() => setFilter(ListAction.COMPLETED)}
            >
              Completed
            </a>
          </nav>

          <button
            type="button"
            className={classNames(
              'todoapp__clear-completed',
              { 'is-invisible': !compleatedTodosLength },
            )}
            onClick={handleDeleteCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
