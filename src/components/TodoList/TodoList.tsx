import React, { useContext } from 'react';
import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';
import { TodoContext } from '../../TodoContext/TodoContext';

type Props = {
  todos: TodoType[];
};

export const TodoList: React.FC<Props> = ({ todos }) => {
  const { tempTodo, activeTodo } = useContext(TodoContext);

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
