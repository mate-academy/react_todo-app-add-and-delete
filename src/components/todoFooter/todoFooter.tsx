import React from 'react';
import { Todo } from '../../types/Todo';
import { FilterStatus } from '../../types/filterStatus';

// Масив фільтрів тепер ізольований всередині футера
const FILTERS = [
  { value: FilterStatus.ALL, label: 'All' },
  { value: FilterStatus.ACTIVE, label: 'Active' },
  { value: FilterStatus.COMPLETED, label: 'Completed' },
];

interface Props {
  todos: Todo[];
  filterStatus: FilterStatus;
  setFilterStatus: (value: FilterStatus) => void;
  clearCompleted: () => Promise<void>;
}

export const TodoFooter: React.FC<Props> = ({
  todos,
  filterStatus,
  setFilterStatus,
  clearCompleted,
}) => {
  // Спочатку обчислюємо значення, чи є хоча б одна виконана справа
  const hasCompletedTodos = todos.some(todo => todo.completed);

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {todos.filter(t => !t.completed).length} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {FILTERS.map(({ value, label }) => {
          const dataCy = `FilterLink${label}`;

          return (
            <a
              key={value}
              href={`#/${value === FilterStatus.ALL ? '' : value}`}
              className={`filter__link ${filterStatus === value ? 'selected' : ''}`}
              data-cy={dataCy}
              onClick={event => {
                event.preventDefault();
                setFilterStatus(value);
              }}
            >
              {label}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        disabled={!hasCompletedTodos} // Кнопка буде вимкнена, якщо немає виконаних справ
        onClick={clearCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
