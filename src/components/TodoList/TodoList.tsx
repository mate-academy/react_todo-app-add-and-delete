import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[],
  OnRemove: (param: number) => void,
  selectedId: number[],
  isAdding: boolean,
};

export const TodoList: React.FC<Props> = ({
  todos,
  OnRemove,
  selectedId,
  isAdding,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onRemove={OnRemove}
          selectedId={selectedId}
          isAdding={isAdding}
          key={todo.id}
        />
      ))}
    </section>
  );
};
