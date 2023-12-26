import { useContext } from 'react';
import { TodosContext } from '../context/TodosContext';
import { getFilteredTasks } from '../service/getFilteredTasks';
import { TodoItem } from './TodoItem';

export const TodoMain = () => {
  const { todos, filter, tempTodo } = useContext(TodosContext);

  const filterCompletedTasks = getFilteredTasks(todos, filter);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterCompletedTasks.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} key={tempTodo.id} />
      )}
    </section>
  );
};
