import React from 'react';
import { TodoProvider, useTodos } from './utils/TodoContext';
import { UserWarning } from './UserWarning';
import { Errors } from './components/Errors/Errors';
import { TodoContent } from './components/TodoContent/TodoContent';
import { Footer } from './components/Footer/Footer';
import { TodoList } from './components/TodoList/TodoList';

const AppContent: React.FC = () => {
  const { todos } = useTodos();

  if (!todos) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <TodoContent>
        <TodoList />
        <Footer />
      </TodoContent>
      <Errors />
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
