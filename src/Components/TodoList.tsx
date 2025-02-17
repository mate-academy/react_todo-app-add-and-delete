import { useContext } from 'react';
import { TodoContext } from './TodoContext';
import { TodoListItem } from './TodoListItem';
import { Todo } from '../types/Todo';

type FilterSettings = string;

function filterList(list: Todo[], settings: FilterSettings): Todo[] {
  return list.filter(item => {
    switch (settings) {
      case 'active':
        return item.completed === false;
      case 'completed':
        return item.completed === true;
      case 'all':
        return item;
      default:
        return;
    }
  });
}

export const TodoList = () => {
  const { todosList, filterSettings, tempTodo } = useContext(TodoContext);
  const preparedList = filterList(todosList, filterSettings);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {preparedList.map(todo => (
        <TodoListItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TodoListItem todo={tempTodo} key={0} />}
    </section>
  );
};
