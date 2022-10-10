import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[],
  selectedTodo: number[];
  handleDelete: (id: number)=> void;
  isDelete: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  selectedTodo,
  handleDelete,
  isDelete,
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
        isDelete={isDelete}
      />
    ))}
  </section>
);
