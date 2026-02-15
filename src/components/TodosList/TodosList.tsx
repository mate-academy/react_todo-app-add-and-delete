import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type TodosListProps = {
  todos: Todo[];
  filteredTodos: Todo[];
};

export const TodosList = ({ todos, filteredTodos }: TodosListProps) => {
}: TodosListProps) => {
  return (
    <>
      {todos.length > 0 && (
        <section className="todoapp__main" data-cy="TodoList">
          {filteredTodos.map(todo => (
            <TodoItem todo={todo} key={todo.id} />
          ))}
        </section>
      )}
    </>
  );
};
