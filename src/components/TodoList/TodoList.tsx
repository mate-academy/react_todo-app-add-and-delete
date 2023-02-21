import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

type Props = {
  todos: Todo[];
  onDelete: (todoToDelete: Todo) => void;
  tempTodo: Todo | null;
  isEditingTodoId: number;
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDelete,
  tempTodo,
  isEditingTodoId,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        key={todo.id}
        todo={todo}
        onDelete={onDelete}
        isEditingTodoId={isEditingTodoId}
      />
    ))}

    {tempTodo && (
      <TodoInfo
        todo={tempTodo}
        onDelete={onDelete}
        isEditingTodoId={isEditingTodoId}
      />
    )}
  </section>
);
