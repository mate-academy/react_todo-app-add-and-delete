import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDeleteTodo: (todoId: number) => () => void;
  isDeleting: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onDeleteTodo,
  isDeleting,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isDeleting={isDeleting}
            onDelete={onDeleteTodo}
          />
        );
      })}

      {!!tempTodo && (
        <TodoItem
          key={0}
          todo={tempTodo}
          isDeleting={isDeleting}
          onDelete={onDeleteTodo}
        />
      )}
    </section>
  );
};
