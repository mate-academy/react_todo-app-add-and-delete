import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoTask } from '../TodoTask';
import { TempTodo } from '../TempTodo';

interface Props {
  preparedTodos: Todo[];
  tempTodo: Todo | null;
  processing: number[];
  onRemoveTodo: (id: number) => void;
}

export const TodoList: FC<Props> = ({
  preparedTodos,
  tempTodo,
  processing,
  onRemoveTodo,
}) => {
  return (
    <section className="todoapp__main">
      {preparedTodos.map(todo => (
        <TodoTask
          key={todo.id}
          todo={todo}
          isLoading={processing.includes(todo.id)}
          onRemoveTodo={onRemoveTodo}
        />
      ))}

      {tempTodo && (
        <TempTodo title={tempTodo.title} />
      )}
    </section>
  );
};
