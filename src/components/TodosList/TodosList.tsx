import { FC } from 'react';
import { Todo } from '../../types/Todo';
import { TempTodoInfo } from '../TodoInfo/TempTodoInfo';
import { TodoInfo } from '../TodoInfo/TodoInfo';

interface Props {
  todos: Todo[],
  tempTodo: Todo | null,
  getTodoId: (id: number) => void,
  removesTodo: (id: number[]) => void,
  loadingTodos: number[],
}

export const TodosList: FC<Props> = ({
  todos,
  tempTodo,
  getTodoId,
  removesTodo,
  loadingTodos,
}) => (
  <section className="todoapp__main">
    {todos.map(todo => (
      <TodoInfo
        todo={todo}
        getTodoId={getTodoId}
        removesTodo={removesTodo}
        loadingTodos={loadingTodos}
        key={todo.id}
      />
    ))}

    {tempTodo && (
      <TempTodoInfo
        tempTodo={tempTodo}
        key={tempTodo.id}
      />
    )}
  </section>
);
