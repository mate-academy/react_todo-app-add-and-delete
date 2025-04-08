import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type TodoListProps = {
  deletedIds: number[];
  todoFilter: Todo[];
  handleToggle: (id: number, completed: boolean) => void;
  handleDeleteTodo: (id: number) => void;
  tempTodo: Todo | null;
};

export const TodoList: React.FC<TodoListProps> = ({
  deletedIds,
  todoFilter,
  handleToggle,
  handleDeleteTodo,
  tempTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todoFilter.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          handleToggle={handleToggle}
          handleDeleteTodo={handleDeleteTodo}
          isLoading={deletedIds.includes(todo.id)}
        />
      ))}
      {tempTodo && (
        <>
          <TodoItem
            key="tempTodo"
            todo={tempTodo}
            handleToggle={() => {}}
            handleDeleteTodo={() => {}}
            isLoading={true}
          />
        </>
      )}
    </section>
  );
};
