import { Todo } from '../../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[],
  isLoading: boolean,
  onDelete: (todoId: number) => void,
};

export const TodoList: React.FC<Props> = (props) => {
  const { todos, isLoading, onDelete } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={isLoading}
          onDelete={onDelete}
        />
      ))}
    </section>
  );
};
