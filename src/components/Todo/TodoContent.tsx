import { TodoHeader } from './TodoHeader';
import { TodoList } from './TodoList';

export const TodoContent = () => {
  return (
    <div className="todoapp__content">
      <TodoHeader />

      <TodoList />
    </div>
  );
};
