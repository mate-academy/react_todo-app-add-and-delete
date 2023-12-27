import { useContext, useMemo } from 'react';
import { StateContext } from '../../libs/state';
import {
  TodoCreate,
  TodoList,
  TodosFilter,
  ToggleAll,
  RemoveCompleted,
  ActiveTodosCount,
} from './components';

import { ErrorNotification } from '../ErrorNotification';

export const TodoApp: React.FC = () => {
  const { todos } = useContext(StateContext);

  const isVisible = !!todos.length;

  const completedCount = useMemo(() => (
    todos.filter(({ completed }) => completed).length
  ), [todos]);

  const activeCount = todos.length - completedCount;

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {isVisible && (
            <ToggleAll hasActiveTodos={!!activeCount} />
          )}

          <TodoCreate />
        </header>

        <TodoList />

        {isVisible && (
          <footer className="todoapp__footer" data-cy="Footer">
            <ActiveTodosCount activeCount={activeCount} />

            <TodosFilter />

            <RemoveCompleted hasCompleted={!!completedCount} />
          </footer>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
