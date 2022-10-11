import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  removeTodo: (id: number) => Promise<void>;
  isAdding: boolean;
  isDeleting: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  isAdding,
  isDeleting,
}) => {
  const temporaryTodo = {
    userId: -1,
    id: 0,
    title: '',
    completed: false,
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
          isAdding={isAdding}
          isDeleting={isDeleting}
          removeTodo={removeTodo}
        />
      ))}

      {isAdding && (
        <TodoItem
          todo={temporaryTodo}
          key={0}
          isAdding={isAdding}
          isDeleting={isDeleting}
          removeTodo={removeTodo}
        />
      )}
    </section>
  );
};
