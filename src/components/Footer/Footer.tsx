import { FC, useMemo } from 'react';
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
  const activeTodos = useMemo(() => (
    todos.filter(todo => !todo.completed).length
  ), [todos]);

  return (
    <>
      {
        todos.length > 0 && (
          <footer className="todoapp__footer">
            <span className="todo-count">
              {`${activeTodos} items left`}
            </span>

            <Nav
              todos={todos}
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
