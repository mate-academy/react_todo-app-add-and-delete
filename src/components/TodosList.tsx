import { useEffect, useMemo, useState } from 'react';
import { TodoItem } from './TodoItem';
import { getFilteredTodos } from '../utils/getFilteredTodos';
import { Todo } from '../types/Todo';
import { Status } from '../types/Status';
import { deleteTodos } from '../api/todos';
import { Error } from '../types/Error';

type Props = {
  todos: Todo[]
  status: Status
  tempTodo: Todo | null,
  setTodos: (val: Todo[]) => void;
  onError: (val: string) => void;
};

export const TodosList: React.FC<Props> = ({
  todos,
  status,
  tempTodo,
  setTodos = () => {},
  onError = () => {},
}) => {
  const [todoIdAction, setTodoIdAction] = useState<string>('');

  const filteredTodo = useMemo(() => {
    return getFilteredTodos(todos, status);
  }, [todos, status]);

  useEffect(() => {
    if (todoIdAction) {
      onError('');
      const [action, todoId] = todoIdAction.split(':');

      if (action === 'true' || action === 'false') {
        setTodos(todos.map(item => {
          return item.id === +todoId
            ? { ...item, completed: !item.completed }
            : item;
        }));
      } else {
        deleteTodos(todoId.toString())
          .then(() => setTodos(todos.filter(todo => todo.id !== +todoId)))
          .catch(() => onError(Error.delete))
          .finally(() => setTodoIdAction(''));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [todoIdAction]);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filteredTodo.map((todo: Todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onTodoAction={setTodoIdAction}
        />
      ))}

      {tempTodo && (
        <TodoItem todo={tempTodo} />
      )}
    </section>
  );
};
