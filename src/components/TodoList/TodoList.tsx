import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  todoTemp: Todo | null;
  isProcessing: Todo | null;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  todoTemp,
  isProcessing,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        todo={todo}
        key={todo.id}
        onDelete={onDelete}
        isProcessing={isProcessing}
      />
    ))}

    {todoTemp && (
      <TodoItem
        todo={todoTemp}
        key={todoTemp.id}
        onDelete={onDelete}
        isProcessing={isProcessing}
      />
    )}
  </section>
);
