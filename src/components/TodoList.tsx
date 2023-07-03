import { FC } from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  inLoadTodosID: number[];
  deleteTodoByID: (arg: number) => void
}

export const TodoList:FC<Props> = ({
  todos,
  tempTodo,
  inLoadTodosID,
  deleteTodoByID,
}) => {
  return (
    <section className="todoapp__main">
      {/* This is a completed todo */}
      {todos.map(todo => {
        const isOnDeletingStage = inLoadTodosID.includes(todo.id);

        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            isLoading={isOnDeletingStage}
            deleteTodoByID={deleteTodoByID}
          />
        );
      })}
      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          deleteTodoByID={deleteTodoByID}
          isLoading
        />
      )}
    </section>
  );
};
