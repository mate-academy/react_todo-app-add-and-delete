import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  filteredTodos: Todo[];
  processingIds: number[];
  deleteTodo: (value: number) => void;
  changeTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  filteredTodos,
  processingIds,
  deleteTodo,
  changeTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            processingIds={processingIds}
            deleteTodo={deleteTodo}
            changeTodo={changeTodo}
          />
        );
      })}
    </section>
  );
};
