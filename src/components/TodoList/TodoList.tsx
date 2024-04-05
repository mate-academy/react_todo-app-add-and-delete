import React from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';
import { useTodos } from '../../utils/hooks';

type Props = {
  todos: TodoType[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo, activeTodo } = useTodos();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => {
        return (
          <Todo
            todo={todo}
            key={todo.id}
            isActive={activeTodo?.id === todo.id}
          />
        );
      })}
      {tempTodo && <Todo todo={tempTodo} key={tempTodo.id} isActive />}
    </section>
  );
};
