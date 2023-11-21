import { useContext, useMemo } from 'react';
import { TodoInfo } from './TodoInfo';
import { TodosContext } from '../context/TodoContext';
import { TodoItem } from './TodoItem';

export const TodoList = () => {
  const { todos, selectedFilter, tempTodo } = useContext(TodosContext);

  const visibleTodos = useMemo(() => {
    return todos.filter((todo) => {
      if (selectedFilter === 'completed') {
        return todo.completed;
      }

      if (selectedFilter === 'active') {
        return !todo.completed;
      }

      return true;
    });
  }, [todos, selectedFilter]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {visibleTodos.map(todo => {
        return <TodoInfo todo={todo} key={todo.id} />;
      })}
      {tempTodo !== null && <TodoItem />}
    </section>
  );
};
