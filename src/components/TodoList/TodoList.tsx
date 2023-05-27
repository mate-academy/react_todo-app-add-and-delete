import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  handleDelete: (todoId: number) => void;
  isBeingAdded: boolean;
  isClearingDoneTodos: boolean;
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  handleDelete,
  isBeingAdded,
  isClearingDoneTodos,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map((todo) => {
        // Only completed todos are being cleared
        const isTodoCompleted = todo.completed;

        return (
          <TodoItem
            key={`todos-${todo.id}`}
            todo={todo}
            handleDelete={handleDelete}
            isBeingCleared={isClearingDoneTodos && isTodoCompleted}
          />
        );
      })}

      {tempTodo && (
        <TodoItem
          key={`tempTodo-${tempTodo.id}`}
          todo={tempTodo}
          handleDelete={handleDelete}
          isBeingAdded={isBeingAdded}
        />
      )}
    </section>
  );
};
