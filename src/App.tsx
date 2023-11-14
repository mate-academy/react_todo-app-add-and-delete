import React, {
  useMemo, useState,
} from 'react';
import './styles/transitions.scss';
import { UserWarning } from './components/UserWarning.tsx/UserWarning';

// types
import { Filters } from './types/Filters';
// components
import { TodoFooter } from './components/TodoFooter/TodoFooter';
import { TodoList } from './components/TodoList/TodoList';
import { NotificationModal } from './components/Notification/Notification';
import { TodoForm } from './components/TodoForm/TodoForm';
import useTodos from './hooks/useTodos';

const USER_ID = 11208;

export const App: React.FC = () => {
  const [filter, setFilter] = useState<Filters>('all');
  const {
    todos,
    loadingTodoId,
    tempTodo,
    error,
    addTodo,
    removeTodo,
    updateTodo,
    removeAllCompleted,
    changeErrorMessage,
    setError,
  } = useTodos(USER_ID);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);

      case 'completed':
        return todos.filter(todo => todo.completed);

      case 'all':
      default:
        return todos;
    }
  }, [filter, todos]);

  const nrOfActiveTodos = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);

  const completedTodosId = useMemo(() => {
    return todos.filter(
      todo => todo.completed,
    ).reduce<number[]>((acc, next) => {
      return [...acc, next.id];
    }, []);
  }, [todos]);

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {(todos.length > 0) && (
            <button
              type="button"
              className="todoapp__toggle-all active"
              aria-label="Toggle between active and not active"
            />
          )}

          {/* Add a todo on form submit */}
          <TodoForm addTodo={addTodo} changeErrorMessage={changeErrorMessage} />
        </header>

        <section className="todoapp__main">
          <TodoList
            todos={filteredTodos}
            tempTodo={tempTodo}
            loadingTodoId={loadingTodoId}
            removeTodo={removeTodo}
            updateTodo={updateTodo}
          />
        </section>

        {todos.length > 0 && (
          <TodoFooter
            filter={filter}
            setFilter={setFilter}
            nrOfActiveTodos={nrOfActiveTodos}
            completedTodosId={completedTodosId}
            clearAll={removeAllCompleted}
          />
        )}
      </div>

      <NotificationModal error={error} clearError={() => setError(null)} />
    </div>
  );
};
