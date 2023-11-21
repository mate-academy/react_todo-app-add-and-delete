import { ErrorProvider, TodosProvider } from './providers';
import { TodoApp } from './components';

export const App: React.FC = () => (
  <ErrorProvider>
    <TodosProvider>
      <TodoApp />
    </TodosProvider>
  </ErrorProvider>
);
