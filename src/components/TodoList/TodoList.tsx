import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[]
  title: string
  onTitle: (title: string) => void
  onDelete: (todoId: number) => void
  loadingTodos: number[]
  tempTodo?: Todo | null
}

export const TodoList: React.FC<Props> = ({
  todos, onTitle, onDelete, loadingTodos, tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          todo={todo}
          onTitle={onTitle}
          onDelete={onDelete}
          loadingTodos={loadingTodos}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          onTitle={onTitle}
          onDelete={onDelete}
          loadingTodos={loadingTodos}
        />
      )}
    </section>
  );
};
