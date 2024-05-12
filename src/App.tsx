import { TodoApp } from './src/components/todoApp';
import { TodosProvider } from './src/services/Store';

export const App: React.FC = () => (
  <TodosProvider>
    <TodoApp />
  </TodosProvider>
);
