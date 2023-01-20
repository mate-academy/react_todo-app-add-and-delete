import { FC, memo } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  todos: Todo[]
  onDeleteTodo: (id: number) => unknown
  deletingTodosIds: number[]
};

export const TodoList: FC<Props> = memo(({
  todos, onDeleteTodo, deletingTodosIds,
}) => (
  <>
    {todos.map(todo => (
      <TodoItem
        key={todo.id}
        todo={todo}
        onDeleteTodo={onDeleteTodo}
        isDeleting={deletingTodosIds.includes(todo.id)}
      />
    ))}
  </>
));
