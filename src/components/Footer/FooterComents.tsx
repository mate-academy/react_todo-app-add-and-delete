import React from 'react';
import classNames from 'classnames';
import { FilterStatus } from '../../App';

interface FooterProps {
  uncompletedTodosCount: number;
  filterStatus: FilterStatus;
  setFilterStatus: (status: FilterStatus) => void;
  handleDeleteClearCompleted: () => void;
  completedTodosCount: number;
}

export const Footer: React.FC<FooterProps> = ({
  uncompletedTodosCount,
  filterStatus,
  setFilterStatus,
  handleDeleteClearCompleted,
  completedTodosCount,
}) => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {uncompletedTodosCount} items left
      </span>

      <nav className="filter" data-cy="Filter">
        {/* Перетворюємо об'єкт статусів у масив значень і проходимо по кожному
            за допомогою .map

              - Object.values(FilterStatus) - потрібен для того щоб зробити ці 3+ кнопки без дублювання коду.
                Він перетворює об'єкт FilterStatus у масив його значень (наприклад, ['all', 'active', 'completed']),
                і ми проходимо по цьому масиву за допомогою .map, створюючи для кожного статусу відповідну кнопку фільтрації.
                Це дозволяє легко додавати нові статуси в майбутньому, просто додавши їх до об'єкта FilterStatus,
                без необхідності писати додатковий код для кожного нового статусу.
        */}
        {Object.values(FilterStatus).map(status => (
          <a
            key={status} // Унікальний ключ для React (назва статусу)
            /* Формуємо посилання: якщо статус "All", посилання пусте (#/), інакше додаємо назву статусу */
            href={`#/${status === FilterStatus.All ? '' : status}`}
            /* Динамічно додаємо клас 'selected', якщо цей фільтр зараз обраний */
            className={classNames('filter__link', {
              selected: filterStatus === status,
            })}
            /* Спеціальний атрибут для автоматизованих тестів (Cypress), робить першу літеру великою */
            data-cy={`FilterLink${status.charAt(0).toUpperCase() + status.slice(1)}`}
            /* При натисканні змінюємо стан фільтрації в додатку */
            onClick={() => setFilterStatus(status)}
          >
            {/* Відображаємо текст посилання, роблячи першу літеру великою (напр. "all" -> "All") */}
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </a>
        ))}
      </nav>

      <button
        type="button"
        className={classNames('todoapp__clear-completed', {
          hidden: completedTodosCount === 0,
        })}
        data-cy="ClearCompletedButton"
        onClick={handleDeleteClearCompleted}
        disabled={completedTodosCount === 0}
      >
        Clear completed
      </button>
    </footer>
  );
};
