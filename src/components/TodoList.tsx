import { Todo } from '../types/Todo';
import { TodoInfo } from './TodoInfo';

type Props = {
  todos: Todo[],
  removeTodo: (TodoId: number) => Promise<void>,
  selectedId: number[],
  isAdding: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  removeTodo,
  selectedId,
  isAdding,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => (
        <TodoInfo
          key={todo.id}
          todo={todo}
          removeTodo={removeTodo}
          selectedId={selectedId}
          isAdding={isAdding}
        />
      ))}
    </section>
  );
};
