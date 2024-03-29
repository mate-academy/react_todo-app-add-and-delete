import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[];
  loading: boolean;
  onSelectTodo?: (currentTodo: Todo) => void;
  selectedTodo?: Todo | null;
  onDeleteTodo?: (currentTodoId: number) => void;
  isSubmiting: boolean;
};

export const TodoList: React.FC<Props> = ({
  todos,
  loading,
  onSelectTodo = () => {},
  selectedTodo,
  onDeleteTodo = () => {},
  isSubmiting,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo: Todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            todoLoading={loading}
            onSelect={onSelectTodo}
            selected={selectedTodo}
            onDelete={onDeleteTodo}
            todoIsSubmiting={isSubmiting}
          />
        );
      })}
    </section>
  );
};
