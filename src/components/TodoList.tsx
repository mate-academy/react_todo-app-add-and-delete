import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[],
  handleDelete: (id: number) => void,
  todoIdToDelete: number,
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleDelete,
  todoIdToDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleDelete={handleDelete}
          isActive={todoIdToDelete === todo.id}
          key={todo.id}
        />
      ))}
    </section>
  );
};
