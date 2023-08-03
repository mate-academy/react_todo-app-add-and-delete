import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  onDeleteTodo: (id: number) => void,
  tempTodo: Todo | null,
  loadingTodoId: number | null,
};

export const TodoList: React.FC<Props> = ({
  todos,
  onDeleteTodo = () => { },
  tempTodo,
  loadingTodoId,
}) => {
  return (
    <section className="todoapp__main">
      <ul className="todo-list">
        {todos.map((todo) => (
          <TodoItem
            todo={todo}
            key={todo.id}
            onDeleteTodo={onDeleteTodo}
            loading={loadingTodoId === todo.id}
          />
        ))}

        {tempTodo && (
          <TodoItem
            key={tempTodo.id}
            todo={tempTodo}
            onDeleteTodo={onDeleteTodo}
            loading
          />
        )}
      </ul>
    </section>
  );
};
