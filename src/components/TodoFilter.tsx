import { useContext } from 'react';
import classNames from 'classnames';
import { Select } from '../types/Select';
import { DispatchContext, StateContext } from './MainContext';
import { Todo } from '../types/Todo';
import { ActionTypes } from '../types/ActionTypes';
import { deleteTodo } from '../api/todos';

const filterValues = [
  {
    id: 0,
    title: Select.ALL,
    'data-cy': 'FilterLinkAll',
    link: '#/',
  },
  {
    id: 1,
    title: Select.ACTIVE,
    'data-cy': 'FilterLinkActive',
    link: '#/active',
  },
  {
    id: 2,
    title: Select.COMPLETED,
    'data-cy': 'FilterLinkCompleted',
    link: '#/completed',
  },
];

const getItemsLeft = (todosList: Todo[]): number => {
  return todosList.filter(todo => !todo.completed).length;
};

export const TodoFilter = () => {
  const { todos, selectPage } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  const itemsLeft = getItemsLeft(todos);
  const itemsCompleted = todos.filter(todo => todo.completed).length;

  const handleClearCompleted = () => {
    dispatch({
      type: ActionTypes.LoadingIdTodos,
      payload: todos.filter(todo => todo.completed).map(todo => todo.id),
    });

    Promise.all(
      todos
        .filter(todo => todo.completed)
        .map(todo =>
          deleteTodo(todo.id)
            .then(() => {
              dispatch({
                type: ActionTypes.DeleteTodo,
                payload: todo.id,
              });
            })
            .catch(() => {
              dispatch({
                type: ActionTypes.SetValuesByKeys,
                payload: {
                  errorMessage: 'Unable to delete a todo',
                },
              });
            }),
        ),
    );
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {itemsLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {filterValues.map(value => (
          <a
            href={value.link}
            className={classNames('filter__link', {
              selected: value.title === selectPage,
            })}
            data-cy={value['data-cy']}
            key={value.id}
            onClick={() =>
              dispatch({
                type: ActionTypes.SetValuesByKeys,
                payload: {
                  selectPage: value.title as Select,
                },
              })
            }
          >
            {value.title}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handleClearCompleted}
        disabled={!itemsCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
