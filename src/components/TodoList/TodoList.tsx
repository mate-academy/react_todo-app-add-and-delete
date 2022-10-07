import React from 'react';
import { TodoItem } from '../TodoItem';
import { Todo } from '../../types/Todo';
import { TodoItemLoad } from '../TodoItemLoad';

type Props = {
  todos: Todo[],
  removeTodo: (todoId: number) => void,
  isAdding: boolean,
  newText: string,
  deleteCompleted: boolean,
};

export const TodoList: React.FC<Props> = (
  {
    todos,
    removeTodo,
    isAdding,
    newText,
    deleteCompleted,
  },
) => {
  return (
    <>
      {
        todos.map((todo: Todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            removeTodo={removeTodo}
            deleteCompleted={deleteCompleted}
          />
        ))
      }
      {isAdding && (
        <TodoItemLoad text={newText} />
      )}
    </>
  );
};
