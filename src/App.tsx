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

  const {
    todos,
    processedIds,
    error,
    tempTodo,
    handleAddTodo,
    handleDeleteTodo,
    handleClearCompleted,
    setProcessedIds,
  } = useTodos(USER_ID);

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
            <button
              type="button"
              className="todoapp__toggle-all active"
              aria-label="AddTodo"
            />
          )}

          <TodoForm addTodo={handleAddTodo} loading={!!tempTodo} />
        </header>

        <TodoList
          todos={filteredTodos}
          deleteTodo={handleDeleteTodo}
          setProcessed={setProcessedIds}
          tempTodo={tempTodo}
          processedTodos={processedIds}
        />

        {todos.length > 0 && (
          <TodoFilter
            activeFilter={activeFilter}
            changeFilter={setActiveFilter}
            activeTodosCount={active.length}
            completedTodosCount={completed.length}
            clearCompleted={() => handleClearCompleted(completed)}
          />
        )}
      </div>

      {error && <TodoError errorMsg={error} />}
    </div>
  );
};
