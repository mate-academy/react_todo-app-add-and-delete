import { useContext } from 'react';

import { TodoItem } from '../TodoItem/TodoItem';
import { TodosContext } from '../TodoContext/TodoContext';

export const TodoList = () => {
  const { filterTodos, tempTodo, processingIds } = useContext(TodosContext);

  return (
    <section className="todoapp__main">
      {filterTodos().map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          isProcessed={processingIds.includes(todo.id)}
        />
      ))}

      {tempTodo && (
        <TodoItem
          key={tempTodo.id}
          todo={tempTodo}
          isProcessed
        />
      )}
    </section>
  );
};
