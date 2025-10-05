import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  onToggleTodo: (id: number, completed: boolean) => void;
  loadingTodoId: number | null;
  deletedTodo: (todoId: number) => void;
};

const TodoList: React.FC<Props> = ({
  todos,
  onToggleTodo,
  loadingTodoId,
  deletedTodo,
}) => {
  return (
    <>
      <section className="todoapp__main" data-cy="TodoList">
        {todos.map(todo => {
          return (
            <TodoItem
              key={todo.id}
              deletedTodo={deletedTodo}
              todo={todo}
              onToggle={onToggleTodo}
              isLoading={loadingTodoId === todo.id}
            />
          );
        })}
      </section>
    </>
  );
};

export default TodoList;
