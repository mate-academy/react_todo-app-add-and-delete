import { Errors } from '../../types/Errors';
import { Todo } from '../../types/Todo';
import { TempTodoInfo } from '../TempTodoInfo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo [],
  tempTodo: Todo | null,
  showError: (message: Errors) => void,
  getTodosFromServer: () => void,
  isClearCompleted:boolean,
}

export const TodoList: React.FC<Props> = ({
  todos,
  tempTodo,
  showError,
  getTodosFromServer,
  isClearCompleted,
}) => {
  return (
    <section className="todoapp__main">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          showError={showError}
          getTodosFromServer={getTodosFromServer}
          isClearCompleted={isClearCompleted}
        />
      ))}

      {tempTodo && <TempTodoInfo tempTodo={tempTodo} />}
    </section>
  );
};
