import { Todo } from '../../types/Todo';
import { TodoError } from '../../types/TodoFilter';
import { TempTodo } from '../TempTodo';
import { TodoInfo } from '../TodoInfo';

type Todos = {
  todos: Todo[]
  todosUpdate: () => void
  errorHandler: (errorType: TodoError) => void
  isAdding: boolean
  formInput: string
};

export const TodoList: React.FC<Todos> = ({
  todos,
  todosUpdate,
  errorHandler,
  isAdding,
  formInput,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
        <TodoInfo
          todo={todo}
          key={todo.id}
          todosUpdate={todosUpdate}
          errorHandler={errorHandler}
        />
      ))}
      <TempTodo
        isAdding={isAdding}
        formInput={formInput}
      />
    </section>
  );
};
