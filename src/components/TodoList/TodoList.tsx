import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  onUpdate: (todoToUpdate: Partial<Todo> & Pick<Todo, 'id'>) => Promise<void>;
  onDelete: (todoId: number) => Promise<void>;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onUpdate,
  onDelete,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {/* This is a completed todo */}
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    ))}
    {tempTodo && (
      <TodoInfo
        key={tempTodo.id}
        todo={tempTodo}
        onUpdate={onUpdate}
        onDelete={onDelete}
      />
    )}
  </section>
);
