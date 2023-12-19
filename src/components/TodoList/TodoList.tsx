import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  todoTemp: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  todoTemp,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        onDelete={onDelete}
      />
    ))}

    {todoTemp && (
      <TodoItem
        todo={todoTemp}
        key={todoTemp.id}
        onDelete={onDelete}
      />
    )}
  </section>
);
