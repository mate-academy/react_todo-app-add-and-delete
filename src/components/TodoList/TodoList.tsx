import { FC } from 'react';
import { Todo } from '../TodoItem/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  onDelete: (id: number) => void,
}

export const TodoList: FC<Props> = (props) => {
  const {
    todos,
    tempTodo,
    onDelete,
  } = props;

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={0}
          onDelete={onDelete}
        />
      )}
    </section>
  );
};
