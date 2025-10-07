import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type PropsList = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  selectedIds: number[];
};

export const TodoList: React.FC<PropsList> = ({
  todos,
  onDelete,
  selectedIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map((todo: Todo) => {
      return (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
          selectedIds={selectedIds}
        ></TodoItem>
      );
    })}
  </section>
);
