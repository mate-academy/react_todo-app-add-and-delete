/* eslint-disable jsx-a11y/control-has-associated-label */
import { useMemo, useState } from 'react';
import { UserWarning } from './UserWarning';
import { TodoList } from './components/TodoList/TodoList';
import { Filters, TodoFilter } from './components/TodoFilter/TodoFilter';
import { TodoForm } from './components/TodoForm/TodoForm';
import { TodoError } from './components/TodoError/TodoError';
import { useTodos } from './hooks/useTodos';
import { TodoType } from './types/Todo';

const USER_ID = 10538;

type TodosMap = {
  all: TodoType[];
  completed: TodoType[];
  active: TodoType[];
};

export const App = () => {
  const [activeFilter, setActiveFilter] = useState<Filters>('all');

  const { todos, error } = useTodos(USER_ID);

  const todosMap: TodosMap = useMemo(
    () => todos.reduce(
      (acc, nextTodo) => {
        const todoMapKey = nextTodo.completed ? 'completed' : 'active';

        return {
          ...acc,
          [todoMapKey]: [...acc[todoMapKey], nextTodo],
        };
      },
      {
        all: todos,
        completed: [],
        active: [],
      },
    ),
    [todos],
  );

  const filteredTodos = todosMap[activeFilter];
  const { completed, active } = todosMap;

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {active.length > 0 && (
            <button type="button" className="todoapp__toggle-all active" />
          )}

          <TodoForm />
        </header>

        <TodoList todos={filteredTodos} />

        {todos.length > 0 && (
          <TodoFilter
            activeFilter={activeFilter}
            changeFilter={setActiveFilter}
            activeTodos={active}
            completedTodos={completed}
          />
        )}
      </div>

      {error && <TodoError errorMsg={error} />}
    </div>
  );
};
