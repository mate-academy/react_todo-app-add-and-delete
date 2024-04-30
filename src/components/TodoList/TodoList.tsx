import { useTodosContext } from '../../context/TodosProvider';
import TempTodo from '../TempTodo';
import TodoItem from '../TodoItem';
import { useMemo } from 'react';

const TodoList = () => {
  const { todos, filter, tempTodo } = useTodosContext();

  const filteredTodos = useMemo(() => {
    let filtered = todos;

    if (filter === 'Active') {
      filtered = todos.filter(todo => !todo.completed);
    }

    if (filter === 'Completed') {
      filtered = todos.filter(todo => todo.completed);
    }

    return filtered;
  }, [filter, todos]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodos.map(todo => (
        <TodoItem todo={todo} key={todo.id} />
      ))}
      {tempTodo && <TempTodo tempTodo={tempTodo} />}
    </section>
  );
};

export default TodoList;
