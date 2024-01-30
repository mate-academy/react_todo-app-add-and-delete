import React, { useContext } from 'react';
import { TodoContext } from '../todoContext';
import { TodoItem } from '../todoItem';

type Props = {};

export const TodoList: React.FC<Props> = () => {
  const { filteredTodo } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul className="todo-list" data-cy="todoList">
        {filteredTodo.map(todo => (
          <TodoItem todo={todo} key={todo.id} />
        ))}
      </ul>
    </section>
  );
};
