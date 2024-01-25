/* eslint-disable jsx-a11y/control-has-associated-label */
import { TodoApp } from './api/utils/TodoApp/TodoApp.tsx';
import { TodosProvider } from './api/utils/TodoContext';

export const App: React.FC = () => {
  return (
    <TodosProvider>
      <TodoApp />
    </TodosProvider>
  );
};
