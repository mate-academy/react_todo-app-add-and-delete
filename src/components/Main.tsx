import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onDelete: (
    setIsDeleting: React.Dispatch<React.SetStateAction<number>>,
    todoItem: Todo,
  ) => void;
};

export const Main: React.FC<Props> = ({ todos, tempTodo, onDelete }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {todos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            isLoading={false}
            onDelete={onDelete}
          />
        );
      })}
      {tempTodo && <TodoItem todo={tempTodo} isLoading onDelete={onDelete} />}
    </section>
  );
};
