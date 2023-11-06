import React, { useContext } from 'react';
import cn from 'classnames';
import { Filter } from '../../types/Filter';
import { Error } from '../../types/Error';
import { StateContext, DispatchContext } from '../../Context/Store';
import { deleteTodo } from '../../api/todos';

type Props = {
  setFilter: (value: Filter) => void;
  filter: Filter;
  countLeft: number;
  haveCompleted: number;
};

export const TodoFooter: React.FC<Props> = ({
  setFilter,
  filter,
  countLeft,
  haveCompleted,
}) => {
  const { todos, userId } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    const deletedPromises = completedTodos
      .map(todo => deleteTodo(todo.id, userId));

    Promise.all(deletedPromises)
      .then(() => {
        completedTodos.forEach(todo => {
          dispatch({
            type: 'deleteTodo',
            payload: todo,
          });
        });
      })
      .catch(() => dispatch({
        type: 'setError',
        payload: Error.UnableDeleteTodo,
      }));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {`${countLeft} items left`}
      </span>

      {/* Active filter should have a 'selected' class */}
      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link',
            { selected: filter === Filter.All })}
          data-cy="FilterLinkAll"
          onClick={() => setFilter(Filter.All)}
        >
          All
        </a>

        <a
          href="#/active"
          className={cn('filter__link',
            { selected: filter === Filter.Active })}
          data-cy="FilterLinkActive"
          onClick={() => setFilter(Filter.Active)}
        >
          Active
        </a>

        <a
          href="#/completed"
          className={cn('filter__link',
            { selected: filter === Filter.Completed })}
          data-cy="FilterLinkCompleted"
          onClick={() => setFilter(Filter.Completed)}
        >
          Completed
        </a>
      </nav>

      {haveCompleted && (
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={handleClearCompleted}
        >
          Clear completed
        </button>
      )}

    </footer>
  );
};
