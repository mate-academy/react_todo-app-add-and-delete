import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TempTodo } from '../TempTodo/TempTodo';

type Props = {
  todos: Todo[];
  isAdding: boolean;
  todoTitle: string;
  onDeleteTodo: (todoId: number) => void;
  deletedTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  todos,
  isAdding,
  todoTitle,
  onDeleteTodo,
  deletedTodoIds,
}) => (
  <section className="todoapp__main" data-cy="TodoList">
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDeleteTodo={onDeleteTodo}
        deletedTodoIds={deletedTodoIds}
      />
    ))}

    {isAdding && <TempTodo todoTitle={todoTitle} />}
  </section>
);
