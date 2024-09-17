import { Dispatch, SetStateAction } from 'react';
import { Filter } from './Filter';
import { Todo } from './types/Todo';

type Props = {
  todosCounter: number;
  filtered: string;
  setFiltered: Dispatch<SetStateAction<string>>;
  HandleClearCompleted: () => void;
  todos: Todo[];
};

export const Footer: React.FC<Props> = ({
  todosCounter,
  filtered,
  setFiltered,
  HandleClearCompleted,
  todos,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosCounter} items left
      </span>

      {/* Active link should have the 'selected' class */}
      <Filter filtered={filtered} setFiltered={setFiltered} />

      {/* this button should be disabled if there are no completed todos */}
      <button
        type="button"
        className="todoapp__clear-completed"
        onClick={HandleClearCompleted}
        data-cy="ClearCompletedButton"
        disabled={todosCounter === todos.length}
      >
        Clear completed
      </button>
    </footer>
  );
};
