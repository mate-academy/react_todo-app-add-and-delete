import { useContext } from 'react';
import { TodoContext } from '../../../context/TodoContext';
import { TodoRender } from '../TodoRender/TodoRender';

export const TodoList = () => {
  const {
    filtredTodos,
  } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filtredTodos.map(todo => (
        <TodoRender
          key={todo.id}
          todo={todo}
        />
      )) }
    </section>
  );
};
