import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem';
import { FilterOptions } from '../../types/FilterOptions';
import { getFilteredTodos } from '../../utils/getFilteredTodos';

interface Props {
  todos: Todo[];
  tempTodo: Todo | null;
  filterOption: FilterOptions;
  onTodoDelete: (id: number) => void;
  loadingTodoIds: number[];
}

export const TodoList: FC<Props> = ({ todos, tempTodo, filterOption, onTodoDelete, loadingTodoIds}) => {
  const filteredTodos = getFilteredTodos(todos, filterOption);
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem key={todo.id} todo={todo} isLoading={loadingTodoIds.includes(todo.id)} onTodoDelete={onTodoDelete}/>
      ))}
      {tempTodo && <TodoItem key={tempTodo.id} todo={tempTodo} isLoading={true} />}
    </section>
  );
};
