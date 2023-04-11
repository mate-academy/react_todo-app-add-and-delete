import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDelete: (id: number) => void;
  deletingCompleted: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  deletingCompleted,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        deleting={deletingCompleted && todo.completed}
        onDelete={() => onDelete(todo.id)}
      />
    ))}
  </section>
);
