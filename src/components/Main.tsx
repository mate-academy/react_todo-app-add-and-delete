import { handleDelete } from '../functions';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { TodoLoading } from './TodoLoading';

interface MainProps {
  todos: Todo[];
  renderTodos: (todos: Todo[]) => void;
  tempTodo: Todo | null;
  newError: (message: string) => void;
  setDeleting: (todo: Todo) => void;
  deleting: number[];
  handleFocus: () => void;
}
export const Main: React.FC<MainProps> = ({
  todos,
  tempTodo,
  newError,
  renderTodos,
  setDeleting,
  deleting,
  handleFocus,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={() =>
            handleDelete(todo, setDeleting, renderTodos, newError)
          }
          isDeleting={deleting.includes(todo.id)}
          handleFocus={handleFocus}
        />
      ))}
      {tempTodo && <TodoLoading title={tempTodo.title} />}
    </section>
  );
};
