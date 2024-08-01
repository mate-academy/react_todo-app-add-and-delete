import React from 'react';
import { UserWarning } from './UserWarning';
import { TodoProvider, useTodos } from './utils/TodoContext';
import { Errors } from './components/Errors/Errors';
import { TodoContent } from './components/TodoContent/TodoContent';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { useClearCompleted } from './hooks/useClearCompleted';

const AppContent: React.FC = () => {
  const { todos, filteredTodos, error, filter } = useTodos();
  const { handleClearCompleted, error: clearCompletedError } =
    useClearCompleted();

  const combinedError = error || clearCompletedError;

  if (!todos) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <TodoContent>
        <TodoList todos={filteredTodos} />
        <Footer
          todos={todos}
          filter={filter}
          onClearCompleted={handleClearCompleted}
        />
      </TodoContent>
      <Errors error={combinedError} />
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
