import { Todo } from '../types/Todo';
import { TodoElement } from './TodoElement';

type Props = {
  todos: Todo[];
  tempTodo: Todo | null;
  onTodoDelete: (todoId: number) => void;
  todoLoadingIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  onTodoDelete,
  tempTodo,
  todoLoadingIds,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <TodoElement
            key={todo.id}
            todo={todo}
            onTodoDelete={onTodoDelete}
            isLoading={todoLoadingIds.includes(todo.id)}
          />
        );
      })}
      {tempTodo && <TodoElement todo={tempTodo} />}
    </section>
  );
};
