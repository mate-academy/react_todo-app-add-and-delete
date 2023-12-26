import { TodoActiveCount } from './TodoActiveCount';
import { TodoClearCompleted } from './TodoClearCompleted';
import { TodoFilter } from './TodoFilter';

export const TodoFooter = () => {
  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <TodoActiveCount />

      <TodoFilter />

      <TodoClearCompleted />
    </footer>
  );
};
