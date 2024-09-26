import { TodosProvider } from './TodosContext/TodosContext';
import { TodoApp } from './components/TodoApp/TodoApp';

export const App = () => {
  return (
    <TodosProvider>
      <TodoApp />
    </TodosProvider>
  );
};
