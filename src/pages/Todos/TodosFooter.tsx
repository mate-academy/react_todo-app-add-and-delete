import { FC } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux';
import {
  selectActiveTodosIds,
  selectCompletedTodosIds,
  selectFilter,
} from '../../store/todos/todosSelectors';
import { todosActions } from '../../store/todos/todosSlice';
import FilterTypes from '../../types/FilterTypes';
import TodosAsync from '../../store/todos/todosAsync';

const TodosFooter:FC = () => {
  const dispatch = useAppDispatch();

  const filter = useAppSelector(selectFilter);
  const activeTodosIds:number[] = useAppSelector(selectActiveTodosIds);
  const completedTodosIds:number[] = useAppSelector(selectCompletedTodosIds);

  const changeFilter = (nextFilter: FilterTypes) => {
    dispatch(todosActions.setFilter(nextFilter));
  };

  const handleRemoveCompletedTodos = () => {
    dispatch(todosActions.setLoadingTodos(completedTodosIds));
    completedTodosIds.forEach((todoId: number) => {
      dispatch(TodosAsync.deleteTodo(todoId));
    });

    setTimeout(() => {
      dispatch(todosActions.setInitialField('loadingTodosIds'));
    }, 100);
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodosIds.length} items left`}
      </span>

      <nav>
        <ul className="filter" data-cy="Filter">
          {(Object.keys(FilterTypes) as Array<keyof typeof FilterTypes>)
            .map(key => (
              // eslint-disable-next-line
              <li
                key={key}
                data-cy={`FilterLink${FilterTypes[key]}`}
                className={`filter__link ${filter === FilterTypes[key] ? 'selected' : ''}`}
                onClick={() => changeFilter(FilterTypes[key])}
              >
                {key}
              </li>
            ))}
        </ul>
      </nav>

      <button
        data-cy="ClearCompletedButton"
        type="button"
        className="todoapp__clear-completed"
        onClick={handleRemoveCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};

export default TodosFooter;
