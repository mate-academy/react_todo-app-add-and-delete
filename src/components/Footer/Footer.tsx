import cn from 'classnames';

import { Dispatch, SetStateAction } from 'react';

import { SortFields } from '../../types/sortFields';
import { Todo } from '../../types/Todo';

type Props = {
  setSelectedField: (string: SortFields) => void;
  deleteTodo: (todoId: number) => Promise<void>;
  selectedField: string;
  todos: Todo[];
  setLoadingIds: Dispatch<SetStateAction<number[]>>;
};

export const Footer: React.FC<Props> = ({
  setSelectedField,
  selectedField,
  todos,
  deleteTodo,
  setLoadingIds,
}) => {
  const hasCompletedTodos = !todos.find(todo => todo.completed);
  const todosLeft = todos.filter(todo => !todo.completed).length;

  const onClearCompleted = (list: Todo[]) => {
    const completedTodosId = list
      .filter(todo => todo.completed)
      .map(todo => todo.id);

    setLoadingIds(completedTodosId);

    return completedTodosId.forEach(id => deleteTodo(id));
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todosLeft} items left
      </span>

      <nav className="filter" data-cy="Filter">
        <a
          href="#/"
          className={cn('filter__link', {
            selected: selectedField === SortFields.default,
          })}
          data-cy="FilterLinkAll"
          onClick={() => setSelectedField(SortFields.default)}
        >
          {SortFields.default}
        </a>

        <a
          href="#/active"
          className={cn('filter__link', {
            selected: selectedField === SortFields.active,
          })}
          data-cy="FilterLinkActive"
          onClick={() => setSelectedField(SortFields.active)}
        >
          {SortFields.active}
        </a>

        <a
          href="#/completed"
          className={cn('filter__link', {
            selected: selectedField === SortFields.completed,
          })}
          data-cy="FilterLinkCompleted"
          onClick={() => setSelectedField(SortFields.completed)}
        >
          {SortFields.completed}
        </a>
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={() => onClearCompleted(todos)}
        disabled={hasCompletedTodos}
      >
        Clear completed
      </button>
    </footer>
  );
};
