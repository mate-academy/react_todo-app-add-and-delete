import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';

type TodoListProps = {
  todos: Todo[];
  addingTodoId: number | null;
  setAddingTodoId: (id: number | null) => void;
  handleDelete: (id: number) => void;
  setError: (error: string) => void;
};

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  addingTodoId,
  setAddingTodoId,
  handleDelete,
  setError,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          addingTodoId={addingTodoId}
          setAddingTodoId={setAddingTodoId}
          handleDelete={handleDelete}
          setError={setError}
        />
      ))}
    </section>
  );
};
