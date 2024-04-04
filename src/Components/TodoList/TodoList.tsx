/* eslint-disable jsx-a11y/label-has-associated-control */
import { TodoItem } from '../TodoItem/TodoItem';
import { Todo } from '../../types/Todo';

type Props = {
  currentTodos: Todo[];
  temporaryTodo: Todo | null;
  onDeleteTodo: (id: number) => void;
  allTodosDeleting: boolean;
};

export const TodoList: React.FC<Props> = ({
  currentTodos,
  temporaryTodo,
  onDeleteTodo,
  allTodosDeleting,
}) => {
  return (
    <div>
      {currentTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDeleteTodo={onDeleteTodo}
          allTodosDeleting={allTodosDeleting}
        />
      ))}
      {temporaryTodo && (
        <TodoItem
          todo={temporaryTodo}
          onDeleteTodo={onDeleteTodo}
          key={temporaryTodo.id}
          allTodosDeleting={allTodosDeleting}
        />
      )}
    </div>
  );
};
