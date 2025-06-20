import classNames from 'classnames';
import * as filterServises from '../../servises/TodoFooter';
import React, { useState } from 'react';
import { Todo } from '../../types/Todo';
import { ButtonName } from '../../enums/ButtonsEnum';

type TodoFooterProp = {
  todoList: Todo[];
  getFilteredList: (filterBy: ButtonName) => void;
  clearCompleted: () => void;
};

export const TodoFooter: React.FC<TodoFooterProp> = React.memo(
  ({ todoList, getFilteredList, clearCompleted }) => {
    const [filteredBy, setFilteredBy] = useState<ButtonName>(ButtonName.ALL);

    const handleFilterButtons = (
      event: React.MouseEvent<HTMLAnchorElement>,
    ) => {
      event.preventDefault();

      const text = event.currentTarget.textContent as ButtonName | null;

      if (!text) {
        return;
      } else {
        setFilteredBy(text);
      }

      getFilteredList(text);
    };

    const leftoverItems = todoList.filter(item => !item.completed).length;
    const finishedTodos = todoList.some(item => item.completed);

    return (
      <footer className="todoapp__footer" data-cy="Footer">
        <span className="todo-count" data-cy="TodosCounter">
          {`${leftoverItems} items left`}
        </span>

        {/* Active link should have the 'selected' class */}
        <nav className="filter" data-cy="Filter">
          {filterServises.filteredButtons.map(button => (
            <a
              href={button.href}
              className={classNames(`${button.className}`, {
                selected: filteredBy === button.name,
              })}
              data-cy={button.dataCy}
              key={button.key}
              onClick={handleFilterButtons}
            >
              {button.name}
            </a>
          ))}
        </nav>

        {/* this button should be disabled if there are no completed todos */}
        <button
          type="button"
          className="todoapp__clear-completed"
          data-cy="ClearCompletedButton"
          onClick={clearCompleted}
          disabled={!finishedTodos}
        >
          Clear completed
        </button>
      </footer>
    );
  },
);

TodoFooter.displayName = 'TodoFooter';
