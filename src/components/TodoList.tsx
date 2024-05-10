import React from 'react';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';
import { useTodosContext } from '../TodoContext';

type Props = {
  todos: Todo[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useTodosContext();

  return (
    <>
      {todos.map((todo: Todo) => (
        <TodoItem key={todo.id} todoId={todo.id} todo={todo} />
      ))}

      {tempTodo && <TodoItem key={0} todoId={0} todo={tempTodo} />}
    </>
  );
};
