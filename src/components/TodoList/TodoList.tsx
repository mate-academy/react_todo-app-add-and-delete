import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  toggleTodo: (id: number) => void;
  removeTodo: (id: number) => void;
  isLoading: (id: number) => boolean;
}

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  toggleTodo,
  removeTodo,
  isLoading,
  tempTodo,
}: Props) => {
  return (
    <>
      <section className="todoapp__main focused" data-cy="TodoList">
        {visibleTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            toggleTodo={toggleTodo}
            removeTodo={removeTodo}
            isLoading={isLoading}
          />
        ))}
      </section>
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          toggleTodo={() => {}}
          removeTodo={() => {}}
          isLoading={() => true}
        />
      )}
    </>
  );
};
