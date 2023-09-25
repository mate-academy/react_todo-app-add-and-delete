import React, { useContext } from 'react';
import { Todo } from '../types/Todo';
import { TodoElement } from './TodoElement';
import { TodoContext } from '../Context/TodoContext';

type Props = {
  todos: Todo[],
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos?.map(todo => (
        <TodoElement
          todo={todo}
          key={todo.id}
        />
      ))}
      {tempTodo && (
        <TodoElement
          key={tempTodo.id}
          todo={tempTodo}
        />
      )}
    </section>
  );
};
