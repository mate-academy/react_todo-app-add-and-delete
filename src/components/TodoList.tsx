import { useContext } from 'react';
import { TodosContext } from '../store';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const { todos } = useContext(TodosContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </section>
  );
};
