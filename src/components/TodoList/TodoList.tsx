import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[],
  selectedTodo: number[];
  handleDelete: (id: number)=> void;
}

export const TodoList: React.FC<Props> = ({
  todos,
  selectedTodo,
  handleDelete,
}) => (
  <section
    className="todoapp__main"
    data-cy="TodoList"
  >
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todoItem={todo}
        selectedTodo={selectedTodo}
        handleDelete={handleDelete}
      />
    ))}
  </section>
);
