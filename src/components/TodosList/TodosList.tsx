import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodosListProps = {
  todos: Todo[];
  filteredTodos: Todo[];
  tempTodo: Todo | null;
};

export const TodosList = ({
  todos,
  filteredTodos,
  tempTodo,
}: TodosListProps) => {
  return (
    <>
      {todos.length > 0 && (
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem todo={todo} key={todo.id} />
          ))}
          {tempTodo && <TodoItem todo={tempTodo} isLoading={true} />}
        </section>
      )}
    </>
  );
};
