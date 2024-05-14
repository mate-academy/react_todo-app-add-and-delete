import { StateContext, FilterOfTodos } from '../../utils/Store';
import { useContext } from 'react';
import { TodoItem } from '../../components/TodoItem/TodoItem';

export const TodoList = () => {
  const state = useContext(StateContext);
  const { todos, filterTodos, tempTodo } = state;

  let list = tempTodo ? [...todos, tempTodo] : todos;

  if (filterTodos === FilterOfTodos.Active) {
    list = list.filter(todo => todo.completed === false);
  }

  if (filterTodos === FilterOfTodos.Completed) {
    list = list.filter(todo => todo.completed === true);
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {list.map(todo => (
        <TodoItem todoItem={todo} key={todo.id} />
      ))}
    </section>
  );
};
