import { Todo } from '../../types/Todo';

import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  handleRemoveButton: (id: number) => void;
  loadingsIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  handleRemoveButton,
  loadingsIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          handleRemoveButton={handleRemoveButton}
          loadingsIds={loadingsIds}
          key={todo.id}
        />
      ))}
    </section>
  );
};
