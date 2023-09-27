import { Todo } from '../Todo';
import { useTodosContext } from '../../providers/TodosProvider/TodosProvider';

export const TodoList = () => {
  const { visTodo, loadingTodos, tempTodo } = useTodosContext();

  if (loadingTodos) {
    return <div>Loading todos...</div>;
  }

  return (
    <section className="todoapp__main" data-cy="TodoList">

      {visTodo.map(todo => {
        return (

          <Todo key={todo.id} todo={todo} />

        );
      })}

      {tempTodo && <Todo key={0} todo={tempTodo} />}

    </section>
  );
};
