import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  todosDeleting: Todo['id'][];
  handleDeleteTodo: (todoId: Todo['id']) => void;
};

export const TodoList: React.FC<Props> = ({
  todos,
  todosDeleting,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isLoading={todosDeleting.includes(todo.id)}
          handleDelete={handleDeleteTodo}
        />
      ))}
    </section>
  );
};
