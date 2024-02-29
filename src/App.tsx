import { TodoApp } from './components/TodoApp';
import { TodoProvider } from './context/TodoContext';

export const App: React.FC = () => (
  <TodoProvider>
    <TodoApp />
  </TodoProvider>
);
