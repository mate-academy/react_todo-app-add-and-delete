import React from 'react';
import classNames from 'classnames';
import { Filters } from '../Filters/Filters';
import { AppStateContextType, useAppState } from '../AppState/AppState';
import { getIncompleteTodosCount } from '../function/getIncompleteTodosCount';
import { deleteTodo } from '../../api/todos';

export const Footer: React.FC = () => {
  const {
    todos,
    setTodos,
    setLoading,
    setErrorNotification,
  } = useAppState() as AppStateContextType;

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

    await Promise.all(completedTodoIds.map(id => deleteTodo(id)));

    const updatedTodos = todos.filter(
      todo => !completedTodoIds.includes(todo.id),
    );

    setTodos(updatedTodos);
    setLoading(true);
  };

  return (
    <footer
      className={classNames(
        'todoapp__footer',
        {
          hidden: incompleteTodosCount === 0,
        },
      )}
      data-cy="Footer"
    >
      {incompleteTodosCount > 0 && (
        <>
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
        </>
      )}
    </footer>
  );
};
