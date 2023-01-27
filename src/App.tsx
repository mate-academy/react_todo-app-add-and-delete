/* eslint-disable jsx-a11y/control-has-associated-label */
import { Todos } from './components/Todos';
import { TodosProvider } from './components/Todos/TodosContext';

export const App = () => {
  return (
    <TodosProvider>
      <Todos />
    </TodosProvider>
  );
};
