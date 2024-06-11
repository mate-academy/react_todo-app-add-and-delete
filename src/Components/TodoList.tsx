import { Todo } from '../types/Todo';
import { TempTodoItem } from './TempTodoItem';
import { TodoItem } from './TodoItem';

type Props = {
  mainTodoList: Todo[];
  handleCompleted: (id: number) => void;
  deleteTodo: (id: number) => void;
  tempTodo: Todo | null;
  loadingTodoId: number[];
};

export const TodoList: React.FC<Props> = ({
  mainTodoList,
  handleCompleted,
  deleteTodo,
  tempTodo,
  loadingTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {mainTodoList.length > 0 &&
        mainTodoList.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            handleCompleted={handleCompleted}
            deleteTodo={deleteTodo}
            loadingTodoId={loadingTodoId}
          />
        ))}

      {tempTodo && <TempTodoItem todo={tempTodo} />}
    </section>
  );
};
