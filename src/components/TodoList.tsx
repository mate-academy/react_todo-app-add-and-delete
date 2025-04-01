import { TodoItem } from './TodoItem';
import { Todo } from '../types/Todo';
type Props = {
  getFilter: () => Todo[];
  handleRemoveTodo: (id: number) => void;
  tempTodo: Todo | null;
  isLoading: boolean;
};

export const TodoList: React.FC<Props> = ({
  getFilter,
  handleRemoveTodo: delitePost,
  tempTodo,
  loadingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}

      {getFilter().map(tod => {
        return (
          <TodoItem
            handleRemoveTodo={delitePost}
            tod={tod}
            key={tod.id}
            isLoading={false}
            loadingTodoId={loadingTodoId}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          handleRemoveTodo={delitePost}
          tod={tempTodo}
          key={0}
          isLoading={true}
        />
      )}
    </section>
  );
};
