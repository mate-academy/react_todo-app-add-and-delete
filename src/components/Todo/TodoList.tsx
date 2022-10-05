import { Todo } from '../../types/Todo';
import { TodoInfo } from './TodoInfo';

interface Props {
  todos: Todo[];
  deleteTodo: (value: number) => void;
  isAdding: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  deleteTodo,
  isAdding,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map((todo) => {
        const { id, title, completed } = todo;

        return (
          <TodoInfo
            key={id}
            title={title}
            completed={completed}
            todoId={id}
            deleteTodo={deleteTodo}
            isAdding={isAdding}
          />
        );
      })}
    </section>
  );
};
