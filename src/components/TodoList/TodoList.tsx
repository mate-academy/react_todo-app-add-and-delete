import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';

type Props = {
  visibleTodos: Todo[];
  tempTodo: Todo | null;
  deletingTodoId: number[] | null;
  removeTodo: (id: number) => void;
  complateTodo: (id: number) => void;
};

export const TodoList: React.FC<Props> = ({
  visibleTodos,
  tempTodo,
  deletingTodoId,
  removeTodo,
  complateTodo,
}) => {
  return (
    <>
      {visibleTodos.map(todoItem => (
        <TodoItem
          key={todoItem.id}
          {...{
            todoItem,
            removeTodo,
            complateTodo,
            deletingTodoId,
          }}
        />
      ))}
      {tempTodo && (
        <TodoItem
          {...{
            todoItem: tempTodo,
            removeTodo,
            complateTodo,
            deletingTodoId,
            isTemp: true,
          }}
        />
      )}
    </>
  );
};
