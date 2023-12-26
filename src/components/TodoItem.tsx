import { useContext } from 'react';
import classNames from 'classnames';
import * as TodoService from '../api/todos';
import { Todo } from '../types/Todo';
import { TodosContext } from '../context/TodosContext';
import { Errors } from '../types/Errors';

type Props = {
  todo: Todo
};

export const TodoItem: React.FC<Props> = ({
  todo,
}) => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    tempTodo,
    setIsLoading,
  } = useContext(TodosContext);
  const isTempTodo = tempTodo && tempTodo.id === todo.id;

  const deleteTodo = (taskId: number) => {
    setIsLoading(true);
    const filteredTasks = todos.filter(task => task.id !== taskId);

    setTodos(filteredTasks);

    return TodoService.deletePost(taskId)
      .then(() => {
        setTodos(filteredTasks);
      })
      .catch((error) => {
        setTodos(todos);
        setErrorMessage(Errors.DeleteTodoError);
        throw error;
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div
      data-cy="Todo"
      className={classNames(
        'todo', {
          completed: todo.completed,
        },
      )}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked
        />
      </label>

      <span data-cy="TodoTitle" className="todo__title">
        {todo.title.trim()}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={() => deleteTodo(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={classNames(
          'modal overlay', {
            'is-active': isTempTodo,
          },
        )}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
