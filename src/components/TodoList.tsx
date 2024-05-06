import { TodoType, TodosArrayType } from '../types/Todo';
import Todo from './Todo';

type Props = {
  displayTodos: TodosArrayType;
  tempTodo: null | TodoType;
  deleteTodo: (todoId: number) => Promise<boolean>;
};

export default function TodoList({
  displayTodos,
  tempTodo,
  deleteTodo,
}: Props) {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {displayTodos.map(todo => (
        <Todo key={todo.id} todo={todo} deleteTodo={deleteTodo} />
      ))}
      {tempTodo && <Todo todo={tempTodo} isTemp deleteTodo={deleteTodo} />}
    </section>
  );
}
