import { Todo } from '../types/Todo';
import { Filter } from '../types/Filter';
import { TempTodo } from './TempTodo';
import { TodoItem } from './TodoItem';

type Props = {
  todos: Todo[];
  filter: Filter;
  temporaryTodo: Todo | null;
  handleDelete: (todo:Todo, callback: () => void) => void;
};

const filterTodos = (todos: Todo[], filter: Filter) => {
  let filteredTodos = todos;

  switch (filter) {
    case 'Active':
      filteredTodos = filteredTodos.filter(todo => todo.completed === false);
      break;
    case 'Completed':
      filteredTodos = filteredTodos.filter(todo => todo.completed === true);
      break;
    case 'All':
    default:
  }

  return filteredTodos;
};

export const TodoList = ({
  todos, filter, temporaryTodo, handleDelete,
} : Props) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filterTodos(todos, filter).map(todo => (
        <TodoItem key={todo.id} todo={todo} handleDelete={handleDelete} />

      ))}
      {temporaryTodo && <TempTodo temporaryTodo={temporaryTodo} />}
    </section>
  );
};
