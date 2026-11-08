import cn from 'classnames';
import './TodoList.scss';
import { Todo } from '../../types/Todo';
import { TodoInfo } from '../TodoInfo/TodoInfo';
import { deleteTodo } from '../../api/todos';
import { ErrorType } from '../../types/ErrorType';
import { Dispatch, SetStateAction, useState } from 'react';

type Props = {
  visibleTodos: Todo[] | undefined;
  tempTodo: Todo | null;
  setErrorType: (ErrorType: ErrorType) => void;
  setTodos: Dispatch<SetStateAction<Todo[]>>;
};

export const TodoList = ({
  visibleTodos,
  tempTodo,
  setErrorType,
  setTodos,
}: Props) => {
  const [deletingTodoId, setDeletingTodoId] = useState<number[]>([]);
  const todos = tempTodo ? [...(visibleTodos || []), tempTodo] : visibleTodos;

  const handleDelete = async (todoId: number) => {
    try {
      setErrorType(null);
      setDeletingTodoId(current => [...current, todoId]);

      await deleteTodo(todoId);

      setTodos(currentTodos =>
        currentTodos?.filter(todo => todo.id !== todoId),
      );
    } catch {
      setErrorType('delete');
    } finally {
      setDeletingTodoId(current => current.filter(id => id !== todoId));
    }
  };

  return todos?.map(todo => (
    <div
      key={todo.id}
      data-cy="Todo"
      className={cn('todo', {
        completed: todo.completed,
      })}
    >
      <TodoInfo
        todo={todo}
        isProcessed={todo === tempTodo && tempTodo !== null}
        isDeleting={deletingTodoId.includes(todo.id)}
        onDelete={handleDelete}
      />
    </div>
  ));
};
