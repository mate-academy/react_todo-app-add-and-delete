import { Todo } from '../types/Todo';

import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  deletingTodoId: number | null;
  onDelete: (todoId: number) => void;
};

export const TodoList = ({ todos, deletingTodoId, onDelete }: Props) => {
  return (
    <>
      {todos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          deletingTodoId={deletingTodoId}
          onDelete={onDelete}
        />
      ))}
    </>
  );
};
