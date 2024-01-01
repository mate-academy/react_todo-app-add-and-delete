import { useTodo } from '../providers/TodoProvider';
import { TodoFooter } from './TodoFooter';
import { TodoForm } from './TodoForm';
import { TodoList } from './TodoList';

export const TodoTab = () => {
  const { todos } = useTodo();

  return (
    <div className="todoapp__content">
      <header className="todoapp__header">
        <TodoForm />
      </header>

      <TodoList />
      {!!todos.length && <TodoFooter />}
    </div>
  );
};
