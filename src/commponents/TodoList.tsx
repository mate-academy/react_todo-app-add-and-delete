import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  deleteTodo: (postId: number) => void;
  handleCheckedId: (id: number) => void;
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  selectedId: number | null;
};

export const TodoList = ({
  visibleTodos,
  handleCheckedId,
  deleteTodo,
  tempTodo,
  selectedId,
}: Props) => {
  const finelTodos = tempTodo ? [...visibleTodos, tempTodo] : visibleTodos;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* {tempTodo && <TodoItem todo={tempTodo} />} */}

      {finelTodos.map(todo => {
        return (
          <TodoItem
            todo={todo}
            key={todo.id}
            handleCheckedId={handleCheckedId}
            deleteTodo={deleteTodo}
            selectedId={selectedId}
          />
        );
      })}
    </section>
  );
};

export default TodoList;
