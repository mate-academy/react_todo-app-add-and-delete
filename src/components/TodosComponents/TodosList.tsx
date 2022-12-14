import React from 'react';
import { Todo } from '../../types/Todo';
import { User } from '../../types/User';
import { TodoInfo } from './Todo/TodoInfo';

type Props = {
  todos: Todo[] | null,
  query: string,
  isAdding: boolean,
  user: User,
  todoCurrentId: number,
  DeletingTodo: (id: number) => void,
  onTodoCurrentId: (currId: number) => void,
};

export const TodosList: React.FC<Props> = ({
  todos,
  isAdding,
  query,
  user,
  todoCurrentId,
  DeletingTodo,
  onTodoCurrentId,
}) => {
  return (
    <>
      {todos?.map(todo => (
        <TodoInfo
          key={todo.id}
          todos={todo}
          DeletingTodo={DeletingTodo}
          onTodoCurrentId={onTodoCurrentId}
          todoCurrentId={todoCurrentId}
        />
      ))}

      {isAdding && (
        <TodoInfo
          todos={
            {
              id: 0,
              completed: false,
              title: query,
              userId: user.id,
            }
          }
          isAdding={isAdding}
        />
      )}
    </>
  );
};
