import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TempTodoItem } from '../TempTodoItem/TempTodoItem';

type Props = {
  visibleData: Todo[];
  isLoadingSpinner: boolean;
  tempTodo: Omit<Todo, 'userId'> | null; //we take all besides userId
  onClickDeleteTodo: (todoId: number) => void;
  listDeleteTodoId: number[];
};

export const TodoList: React.FC<Props> = ({
  visibleData,
  isLoadingSpinner,
  tempTodo,
  onClickDeleteTodo,
  listDeleteTodoId,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {/* This is a completed todo */}
      {visibleData.map((todo: Todo) => {
        return (
          <TodoItem
            key={todo.id}
            todo={todo}
            onClickDeleteTodo={onClickDeleteTodo}
            listDeleteTodoId={listDeleteTodoId}
          />
        );
      })}
      {tempTodo && (
        <TempTodoItem tempTodo={tempTodo} isLoadingSpinner={isLoadingSpinner} />
      )}
    </section>
  );
};
