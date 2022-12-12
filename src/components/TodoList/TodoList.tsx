import { Todo } from '../../types/Todo';
import { ActualTodo } from '../ActualTodo/ActualTodo';

interface Props {
  todos: Todo[],
  deletedTodoId: number,
  onDelete: (todoId: number) => void,
}

export const TodoList: React.FC<Props> = ({
  todos,
  deletedTodoId,
  onDelete,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <ActualTodo
          key={todo.id}
          todo={todo}
          deletedTodoId={deletedTodoId}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
