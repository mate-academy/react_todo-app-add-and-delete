import { useContext } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';
import { TodosContext } from '../TodosContext';
import { Status } from '../../types/Status';
import { TempTodoItem } from '../TempTodoItem';

export const TodoList: React.FC = () => {
  const { todos, tempTodo, filterStatus } = useContext(TodosContext);

  const todosFilter = (allTodos: Todo[]) => {
    switch (filterStatus) {
      case Status.Active:
        return todos.filter(todo => !todo.completed);

      case Status.Completed:
        return todos.filter(todo => todo.completed);

      default:
        return allTodos;
    }
  };

  const filteredTodos = todosFilter(todos);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map((item: Todo) => (
        <TodoItem todo={item} key={item.id} />
      ))}

      {tempTodo && (<TempTodoItem tempTodo={tempTodo} />)}
    </section>
  );
};
