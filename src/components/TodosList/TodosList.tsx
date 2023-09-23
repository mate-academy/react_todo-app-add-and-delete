import React from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

type Props = {
  todos: Todo[],
  deletePost: (id: number) => void,
};

export const TodosList: React.FC<Props> = ({ todos, deletePost }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <React.Fragment key={todo.id}>
            <TodoItem
              deletePost={deletePost}
              todo={todo}
            />
          </React.Fragment>
        );
      })}
    </section>
  );
};
