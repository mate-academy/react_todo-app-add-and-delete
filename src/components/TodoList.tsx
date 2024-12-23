import { Todo } from '../types/Todo';
import { TodoComponent } from './TodoComponent';

type Props = {
  filteredTodos: Todo[];
  onRemoveTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({ filteredTodos, onRemoveTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      <div>
        {filteredTodos.map(todo => (
          <TodoComponent
            key={todo.id}
            todo={todo}
            onRemoveTodo={onRemoveTodo}
            isLoading={todo.id === 0}
          />
        ))}
      </div>
    </section>
  );
};
