import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deletedTodoIds: number | null;
  completedTodosID: number[] | null;
  onDelete: (id: number) => void;
}

export const TodoList: FC<Props> = (
  {
    todos,
    tempTodo,
    deletedTodoIds,
    completedTodosID,
    onDelete,
  },
) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={onDelete}
          completedTodosID={completedTodosID}
          idOfDeletedTodo={deletedTodoIds}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={onDelete}
          completedTodosID={completedTodosID}
          idOfDeletedTodo={deletedTodoIds}
        />
      )}
    </section>
  );
};
