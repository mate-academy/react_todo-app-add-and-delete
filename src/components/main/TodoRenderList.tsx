import React, { useContext } from 'react';
import { TodoItem } from './TodoItem';
import { appContext } from '../Context/Context';

export const TodoRenderList: React.FC = () => {
  const { filteredTodos, tempTodo } = useContext(appContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          todo={todo}
          key={todo.id}
        />
      ))}

      {tempTodo && (
        <TodoItem
          todo={tempTodo}
          key={tempTodo.id}
        />
      )}
    </section>
  );
};
