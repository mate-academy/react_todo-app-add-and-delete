import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[],
  onDelete: (todo: number) => void
};

export const TodoList: React.FC<Props> = ({ todos, onDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoInfo
          title={todo.title}
          completed={todo.completed}
          key={todo.id}
          onDelete={onDelete}
          todo={todo}
        />
      ))}
    </section>
  );
};
