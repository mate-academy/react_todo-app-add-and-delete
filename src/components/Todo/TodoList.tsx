import { Todo } from '../../types/Todo';
import { TodoInfo } from './TodoInfo';

interface Props {
  todos: Todo[];
  deleteTodo: (value: number) => void;
  isAdding: boolean;
  selectedId: number | null;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isAdding,
  selectedId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(({ id, title, completed }) => (
        <TodoInfo
          key={id}
          title={title}
          completed={completed}
          todoId={id}
          deleteTodo={deleteTodo}
          isAdding={isAdding}
          selectedId={selectedId}
        />
      ))}
    </section>
  );
};
