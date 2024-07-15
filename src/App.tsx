import React from 'react';
import { UserWarning } from './UserWarning';
import { TodoProvider, useTodos } from './utils/TodoContext';
import { Errors } from './components/Errors/Errors';
import { TodoContent } from './components/TodoContent/TodoContent';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';

const AppContent: React.FC = () => {
  const { todos, filteredTodos, error, setFilter, setError, filter } =
    useTodos();

  if (!todos) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <TodoContent onErrorChange={setError}>
        <TodoList todos={filteredTodos} />
        <Footer todos={todos} filter={filter} onFilterChange={setFilter} />
      </TodoContent>
      <Errors error={error} onErrorChange={setError} />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
};

export default App;
