import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type FilterProps = {
  filteredTodo: Todo[];
  deleteTodo: (todoId: number) => void;
  tempoTodo: Todo | null;
  todoDelete: number[];
};
export const TodoList: React.FC<FilterProps> = ({
  filteredTodo,
  deleteTodo,
  tempoTodo,
  todoDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          tempoTodo={tempoTodo}
          isDeleting={todoDelete.includes(todo.id)}
        />
      ))}
      {tempoTodo && (
        <TodoItem
          todo={tempoTodo}
          key={tempoTodo.id}
          deleteTodo={deleteTodo}
          tempoTodo={tempoTodo}
          isDeleting={true}
        />
      )}
    </section>
  );
};
