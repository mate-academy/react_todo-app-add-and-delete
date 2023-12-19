import { Todo as TodoType } from '../../types/Todo';
import { Todo } from '../Todo/Todo';

interface Props {
  todos: TodoType[],
  onDelete: (id: number) => void,
  addTodo: (title: string, userId: number) => void;
  tempTodo: TodoType | null;
}

export const TodoList: React.FC<Props> = ({ todos, onDelete, tempTodo }) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <Todo
          key={todo.id}
          todo={todo}
          onDelete={onDelete}
        />
      ))}

      {tempTodo && (
        <Todo
          key={tempTodo.id}
          todo={tempTodo}
          onDelete={() => {}}
        />
      )}
    </section>
  );
};
