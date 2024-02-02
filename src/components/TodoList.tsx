import { useContext } from 'react';
import { TodoContext } from '../contexts/TodoContext';
import { TodoItem } from './TodoItem';

export const TodoList: React.FC = () => {
  const {
    filteredTodos,
    tempTodo,
  } = useContext(TodoContext);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <ul className="todolist">
        {filteredTodos.map(todo => (
          <TodoItem todo={todo} />
        ))}
        {!!tempTodo && <TodoItem todo={tempTodo} isTemp /> }
      </ul>
    </section>
  );
};
