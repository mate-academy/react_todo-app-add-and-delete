import { TodoElement } from '../Todo';
import { Todo } from '../../types/Todo';

type Props = {
  todos: Todo[];
  onDelete: (todoId: number) => void;
  idsToDelete: number[];
  tempTodo: Todo | null;
};

export const TodoList = ({ todos, onDelete, idsToDelete, tempTodo }: Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoElement
          todo={todo}
          key={todo.id}
          onDelete={onDelete}
          idsToDelete={idsToDelete}
        />
      ))}

      <TodoElement todo={tempTodo} onDelete={() => {}} idsToDelete={[0]} />
    </section>
  );
};
