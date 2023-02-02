import classNames from 'classnames';
import { useContext, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Error } from '../../types/Error';
import { deleteTodo, patchTodo } from '../../api/todos';
import { TodosContext } from '../TodosContext';
import { AuthContext } from '../Auth/AuthContext';

type Props = {
  todo: Todo,
};

export const TodosItem: React.FC<Props> = ({ todo }) => {
  const [query, setQuery] = useState('');
  const [isLoad, setisLoad] = useState(false);

  const providerValue = useContext(TodosContext);
  const user = useContext(AuthContext);

  const deleteTodosItem = async (todoId: number) => {
    if (user) {
      setisLoad(true);
      providerValue?.setErrorsArgument(null);
      await deleteTodo(todoId)
        .then(() => {
          if (providerValue?.todos) {
            providerValue?.setTodos(
              providerValue.todos.filter((item) => item.id !== todoId),
            );
          }
        })
        .catch(() => providerValue?.setErrorsArgument(Error.Delete));
      setisLoad(false);
    }
  };

  const setCompletedTodo = (completed = false) => {
    if (user && providerValue?.todos) {
      setisLoad(true);
      const data = {
        completed,
      };

      const getChangedTodos = () => {
        let todosList = null;

        if (providerValue.todos) {
          todosList = [...providerValue.todos];

          todosList[providerValue.todos?.indexOf(todo)].completed = completed;
        }

        return todosList;
      };

      patchTodo(todo.id, data)
        .catch(() => providerValue?.setErrorsArgument(Error.Update))
        .finally(() => {
          providerValue?.setTodos(getChangedTodos());
          setisLoad(false);
        });
    }
  };

  return (
    <li
      data-cy="Todo"
      className={classNames('todo', { completed: todo.completed })}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          onClick={() => setCompletedTodo(!todo.completed)}
        />
      </label>

      <span
        onDoubleClick={() => setQuery(todo.title)}
        data-cy="TodoTitle"
        className="todo__title"
      >
        {query || todo.title}
      </span>

      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDeleteButton"
        onClick={() => deleteTodosItem(todo.id)}
      >
        ×
      </button>

      <div
        data-cy="TodoLoader"
        className={
          classNames('modal overlay', { 'is-active': isLoad })
        }
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </li>
  );
};
