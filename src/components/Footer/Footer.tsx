import React from 'react';
import classNames from 'classnames';
import { Filters } from '../Filters/Filters';
import { useAppState } from '../AppState/AppState';
import { getIncompleteTodosCount } from '../function/getIncompleteTodosCount';
import { deleteTodo } from '../../api/todos';

export const Footer: React.FC = () => {
  const {
    todos,
    setTodos,
    setErrorNotification,
    setDeleteLoadingMap,
    setTodosFilter,
  } = useAppState();

  const incompleteTodosCount = getIncompleteTodosCount(todos);

  const completedTodosCount = todos
    ? todos.filter(todo => todo.completed).length
    : 0;

  const handleClearCompleted = async () => {
    if (!todos) {
      setErrorNotification('Unable to delete a todo');

      return;
    }

    const completedTodoIds = todos.filter(
      todo => todo.completed,
    )
      .map(todo => todo.id);

    completedTodoIds.forEach(
      (id) => {
        if (id) {
          setDeleteLoadingMap(
            (prevLoadingMap) => ({ ...prevLoadingMap, [id]: true }),
          );
        }
      },
    );

    await Promise.all(completedTodoIds.map(id => {
      if (id) {
        return deleteTodo(id);
      }

      return null;
    }));

    const updatedTodos = todos.filter(
      todo => !completedTodoIds.includes(todo.id),
    );

    setTodosFilter(updatedTodos);
    setTodos(updatedTodos);
  };

  return (
    <>
      {todos && todos.length > 0 && (
        <footer
          className={classNames(
            'todoapp__footer',
            {
              hidden: !incompleteTodosCount,
            },
          )}
          data-cy="Footer"
        >
          <span className="todo-count" data-cy="TodosCounter">
            {`${incompleteTodosCount} ${incompleteTodosCount === 1 ? 'item' : 'items'} left`}
          </span>
          <Filters />
          {completedTodosCount > 0 ? (
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
            >
              Clear completed
            </button>
          ) : (
            <button
              type="button"
              className="todoapp__clear-completed"
              data-cy="ClearCompletedButton"
              onClick={handleClearCompleted}
              disabled
            >
              Clear completed
            </button>
          )}
        </footer>
      )}
    </>
  );
};
