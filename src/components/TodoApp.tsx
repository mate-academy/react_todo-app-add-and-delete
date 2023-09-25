import { useMemo, useState } from 'react';

import { Status, Todo } from '../types';
import { useTodos } from '../providers';
import { Header } from './Header';
import { NewTodo } from './NewTodo';
import { ToggleAllButton } from './ToggleAllButton';
import { TodoList } from './TodoList';
import { Footer } from './Footer';
import { TodoCounter } from './TodoCounter';
import { TodoFilter } from './TodoFilter';
import { ClearCompletedButton } from './ClearCompletedButton';
import { ErrorNotification } from './ErrorNotification';

export const TodoApp: React.FC = () => {
  const { todos } = useTodos();
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [filterValue, setFilterValue] = useState(Status.All);

  const hasTodos = todos.length > 0 || tempTodo;
  const hasCompleted = todos.some(({ completed }) => completed);
  const isAllCompleted = todos.every(({ completed }) => completed);
  const activeCount = todos.filter(({ completed }) => !completed).length;

  const filteredTodos = useMemo(() => todos.filter(({ completed }) => {
    switch (filterValue) {
      case Status.Active:
        return !completed;

      case Status.Completed:
        return completed;

      case Status.All:
      default:
        return true;
    }
  }), [todos, filterValue]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header>
          {hasTodos && (
            <ToggleAllButton active={isAllCompleted} />
          )}

          <NewTodo onCreate={setTempTodo} />
        </Header>

        {hasTodos && (
          <>
            <TodoList
              todos={filteredTodos}
              tempTodo={tempTodo}
              loading={isLoading}
            />

            <Footer>
              <TodoCounter value={activeCount} />

              <TodoFilter
                value={filterValue}
                onValueChange={setFilterValue}
              />

              <ClearCompletedButton
                active={hasCompleted}
                onClear={setIsLoading}
              />
            </Footer>
          </>
        )}
      </div>

      <ErrorNotification />
    </div>
  );
};
