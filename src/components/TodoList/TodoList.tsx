import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  idOfDeletedTodo: number | null;
  completedTodosID: number[] | null;
  deleteTodo: (id: number) => void;
}

export const TodoList: FC<Props> = (
  {
    todos,
    tempTodo,
    idOfDeletedTodo,
    completedTodosID,
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
          completedTodosID={completedTodosID}
          idOfDeletedTodo={idOfDeletedTodo}
        />
      ))}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodo={deleteTodo}
          completedTodosID={completedTodosID}
          idOfDeletedTodo={idOfDeletedTodo}
        />
      )}
    </section>
  );
};
