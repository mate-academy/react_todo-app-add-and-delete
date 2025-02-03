import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface TodoListProps {
  todos: Todo[];
  tempTodo: Todo | null;
  loadingTodos: number[];
  handleDeleteTodo: (todoId: number) => Promise<void>;
}

export const TodoList: React.FC<TodoListProps> = ({
  todos,
  tempTodo,
  loadingTodos,
  handleDeleteTodo,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => {
        const isActiveModal = loadingTodos.some(id => id === todo.id);

        return (
          <TodoItem
            todo={todo}
            isActiveModal={isActiveModal}
            handleDeleteTodo={handleDeleteTodo}
            key={todo.id}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          isActiveModal={true}
          handleDeleteTodo={handleDeleteTodo}
        />
      )}
    </section>
  );
};
