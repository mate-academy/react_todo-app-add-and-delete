import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { filteredTodos } from '../../utils/filteredTodos';
import { Actions } from '../../types/Actions';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  handleAction: (arg: Actions) => void;
  hasComletedTodos: boolean;
  clearCompleted: () => void;
};

interface SelectedState {
  all: boolean;
  active: boolean;
  completed: boolean;
}

export const FooterTodos: React.FC<Props> = ({
  todos,
  handleAction,
  hasComletedTodos,
  clearCompleted,
}) => {
  const [selected, setSelected] = useState<SelectedState>({
    all: true,
    active: false,
    completed: false,
  });

  const handleSelected = (action: Actions) => {
    setSelected(prevState => {
      const newState = { ...prevState };

      for (const key in newState) {
        if (key !== action) {
          newState[key as keyof SelectedState] = false;
        } else {
          newState[key as keyof SelectedState] = true;
        }
      }

      return newState;
    });
    handleAction(action);
  };

  return (
    <>
      {!!todos.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {filteredTodos(todos, Actions.ACTIVE).length} items left
          </span>

          <nav className="filter" data-cy="Filter">
            {Object.values(Actions).map((action, index) => {
              const upperAction =
                action.slice(0, 1).toUpperCase() + action.slice(1);

              return (
                <a
                  href="#/"
                  className={classNames('filter__link', {
                    selected: selected[action],
                  })}
                  data-cy={`FilterLink${upperAction}`}
                  key={index}
                  onClick={() => handleSelected(action)}
                >
                  {upperAction}
                </a>
              );
            })}
          </nav>

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            disabled={!hasComletedTodos}
            onClick={clearCompleted}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
