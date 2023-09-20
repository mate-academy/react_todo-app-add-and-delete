import { useContext } from 'react';

import { getFilteredTodos } from '../../utils/utils';
import { TodoItem } from '../TodoItem';
import { TodoContext } from '../../context/TodoContext';
import { FilterContext } from '../../context/FilterContext';
import { deleteTodo } from '../../api/todos';
import { TodoTemp } from '../TodoTemp';

export const TodoList: React.FC = () => {
  const { todos, setTodos, tempTodo } = useContext(TodoContext);
  const { selectedFilter } = useContext(FilterContext);

  const filteredTodos = getFilteredTodos(todos, selectedFilter);

  const handleDeleteTodo = (todoId: number) => {
    deleteTodo(todoId);
    setTodos(todos.filter(({ id }) => id !== todoId));
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onDelete={handleDeleteTodo}
        />
      ))}

      {tempTodo && (
        <TodoTemp />
      )}
    </section>
  );
};
