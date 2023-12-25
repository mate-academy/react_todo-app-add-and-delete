import { memo } from 'react';
import { Todo } from '../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { TempTodo } from '../TempTodo/TempTodo';

interface Props {
  todos: Todo [],
  tempTodo: Todo | null,
  onDeleteTodo: (id: number) => void,
  hasLoadingStatus: boolean,
}

export const TodoList: React.FC<Props> = memo(({
  todos,
  tempTodo,
  onDeleteTodo,
  hasLoadingStatus,
}) => (
  <section
    className="todoapp__main"
    data-cy="TodoList"
  >
    {todos.map((todo) => (
      <TodoInfo
        todo={todo}
        key={todo.id}
        onDeleteTodo={onDeleteTodo}
        hasLoadingStatus={hasLoadingStatus}
      />
    ))}

    {tempTodo && <TempTodo todo={tempTodo} />}
  </section>
));
