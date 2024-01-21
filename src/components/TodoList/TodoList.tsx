import { useContext } from 'react';
import { TodoItem } from '../TodoItem';
import { TodosContext } from '../TodoContext/TodoContext';
import { Status } from '../../types/Status';

export const TodoList: React.FC = () => {
  const { todos, filterStatus, tempTodo } = useContext(TodosContext);

  const prepearedTodos = todos.filter(todo => {
    switch (filterStatus) {
      case Status.Active:
        return !todo.completed;

      case Status.Completed:
        return todo.completed;

      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {prepearedTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {!!tempTodo && <TodoItem todo={tempTodo} />}
    </section>
  );
};
