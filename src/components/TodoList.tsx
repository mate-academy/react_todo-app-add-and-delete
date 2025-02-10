import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  filteredTodo: Todo[];
  deleteTodo: (todoId: number) => void;
  tempTodo: Todo | null;
  todoDelete: number[];
};

export const TodoList: React.FC<Props> = ({
  filteredTodo,
  deleteTodo,
  tempTodo,
  todoDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          isDeleting={todoDelete.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
          deleteTodo={deleteTodo}
          tempTodo={tempTodo}
          isDeleting={true}
        />
      )}
    </section>
  );
};
