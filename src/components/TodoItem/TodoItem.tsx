import { ChangeEvent, MouseEvent } from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { client } from '../../utils/fetchClient';
import { useAppContext } from '../Context/AppContext';

type Props = {
  todoInfo: Todo,
};
export const TodoItem = ({ todoInfo }: Props) => {
  const {
    todos,
    setTodos,
    setIsError,
  } = useAppContext();

  const handleCheckboxToggle = (todo: Todo, event: ChangeEvent) => {
    event.preventDefault();

    const newTodo = { ...todo, completed: !todo.completed };

    client.patch(`/todos/${todo.id}`, { completed: !todo.completed })
      .catch(() => {
        setIsError('update');
      });
    const newListOfTodos = todos.map(item => {
      if (item.id === todo.id) {
        return newTodo;
      }

      return item;
    });

    setTodos(newListOfTodos);
  };

  const handleDeleteTodo = (todoId: number, event: MouseEvent) => {
    event.preventDefault();

    client.delete(`/todos/${todoId}`)
      .catch(() => {
        setIsError('delete');
      });
    const newListOfTodos = todos.filter(item => item.id !== todoId);

    setTodos(newListOfTodos);
  };

  return (
    <div
      key={todoInfo.id}
      className={cn('todo', {
        completed: todoInfo.completed,
      })}
    >
      <label className="todo__status-label">
        <input
          type="checkbox"
          className="todo__status"
          checked={todoInfo.completed}
          onChange={(event) => {
            handleCheckboxToggle(todoInfo, event);
          }}
        />
      </label>

      <span className="todo__title">{todoInfo.title}</span>

      <button
        type="button"
        className="todo__remove"
        onClick={(event) => handleDeleteTodo(todoInfo.id, event)}
      >
        x
      </button>

      <div className="modal overlay">
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
