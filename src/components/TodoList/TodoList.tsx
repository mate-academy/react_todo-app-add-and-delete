import { Todo } from '../../types/Todo';
import { ActualTodo } from '../ActualTodo/ActualTodo';

interface Props {
  todos: Todo[],
  deletedTodoIds: number[],
  onDelete: (todoId: number) => void,
}

export const TodoList: React.FC<Props> = ({
  todos,
  deletedTodoIds,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <ActualTodo
          key={todo.id}
          todo={todo}
          deletedTodoIds={deletedTodoIds}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
