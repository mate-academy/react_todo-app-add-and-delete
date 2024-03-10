import { MyProvider } from './components/context/myContext';
import { TodoApp } from './TodoApp';

export const App = () => {
  return (
    <MyProvider>
      <TodoApp />
    </MyProvider>
  );
};
