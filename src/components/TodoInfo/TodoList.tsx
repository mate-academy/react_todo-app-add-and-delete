/* eslint-disable jsx-a11y/label-has-associated-control */
import { useAppContextContainer } from '../../context/AppContext';
import { Todo } from '../../types/Todo';
import TodoListInfo from './TodoInfoList';
import TodoListTemporary from './TodoListTemporary';

type Props = {
  todos: Todo[];
};

const TodoList = ({ todos }: Props) => {
  const { tempTodo } = useAppContextContainer();

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoListInfo key={todo.id} todo={todo} />
      ))}
      {tempTodo && <TodoListTemporary />}
    </section>
  );
};

export default TodoList;
