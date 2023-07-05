import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onTodoDelete: (todoId: number) => void;
  deletedTodoId: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  onTodoDelete,
  deletedTodoId,
}) => (
  <>
    {todos.map(todo => {
      return (
        <TodoItem
          todo={todo}
          key={todo.id}
          onTodoDelete={onTodoDelete}
          deletedTodoId={deletedTodoId}
        />
      );
    })}
    {tempTodo && (
      <TodoItem
        onTodoDelete={onTodoDelete}
        todo={tempTodo}
      />
    )}
  </>
);
