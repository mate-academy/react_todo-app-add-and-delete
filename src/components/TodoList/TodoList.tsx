import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { TempTodo } from '../TempTodo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  deletedTodoIds: number | null;
  completedTodoIds: number[] | null;
  deleteTodo: (id: number) => void;
}

export const TodoList: FC<Props> = (
  {
    todos,
    tempTodo,
    deletedTodoIds,
    completedTodoIds,
    deleteTodo,
  },
) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => (
        <TodoItem
          todo={todo}
          key={todo.id}
          deleteTodo={deleteTodo}
          completedTodoIds={completedTodoIds}
          deletedTodoIds={deletedTodoIds}
        />
      ))}

      {tempTodo && (
        <TempTodo todo={tempTodo} />
      )}
    </section>
  );
};
