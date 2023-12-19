import { TodoForm } from '../TodoForm/TodoForm';
import { ToggleButton } from '../ToggleButton/ToggleButton';

export const TodoHeader = () => {
  return (
    <header className="todoapp__header">
      <ToggleButton />
      <TodoForm />
    </header>
  );
};
