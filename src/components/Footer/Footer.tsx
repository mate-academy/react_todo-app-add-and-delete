import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { SortTypes } from '../../types/SortTypes';
import { Nav } from '../Nav';

interface Props {
  todos: Todo[];
  onChangeFilter: (filter: SortTypes) => void;
  activeFilter: SortTypes;
  onClearCompletedTodos: () => void;
}

export const Footer: FC<Props> = ({
  todos,
  onChangeFilter,
  activeFilter,
  onClearCompletedTodos,
}) => {
  const activeTodos = todos.filter(todo => !todo.completed).length;

  return (
    <>
      {
        todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos} items left`}
            </span>

            {/* Active filter should have a 'selected' class */}
            <Nav
              onChangeFilter={onChangeFilter}
              activeFilter={activeFilter}
              onClearCompletedTodos={onClearCompletedTodos}
            />
          </footer>
        )
      }
    </>
  );
};
