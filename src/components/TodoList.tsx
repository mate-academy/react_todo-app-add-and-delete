import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  visibleTodos: Todo[];
};

export const TodoList: React.FC<TodoListProps> = ({ visibleTodos }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos
        .map((todo: Todo) => <TodoItem key={todo.id} todo={todo} />)}
    </section>
  );
};
