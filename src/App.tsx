import React from 'react';
import { TodoProvider, useTodos } from './utils/TodoContext'; // Poprawny import TodoProvider
import { UserWarning } from './UserWarning';
import { Errors } from './components/Errors/Errors';
import { TodoContent } from './components/TodoContent/TodoContent';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';
import { useClearCompleted } from './hooks/useClearCompleted';

const AppContent: React.FC = () => {
  const { todos, error } = useTodos();
  const { handleClearCompleted, error: clearCompletedError } =
    useClearCompleted();

  const combinedError = error || clearCompletedError;

  if (!todos) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <TodoContent>
        <TodoList />
        <Footer onClearCompleted={handleClearCompleted} />
      </TodoContent>
      <Errors error={combinedError} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <TodoProvider>
      <AppContent />
    </TodoProvider>
  );
};

export default App;
