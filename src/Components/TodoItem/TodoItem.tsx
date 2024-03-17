import React, { useContext } from 'react';
import cn from 'classnames';
import * as todosServise from '../../api/todos';
import { Todo } from '../../types/Todo';
import { TodosContext } from '../TodosContext/TodosContext';

interface Props {
  todo: Todo;
  isLoading ?: boolean;
}

export const TodoItem: React.FC<Props> = ({ todo, isLoading }) => {
  const {
    todos,
    setTodos,
    setErrorMessage,
    loading,
    setLoading,
    activeItemId,
    setActiveItemId,
  } = useContext(TodosContext);

  const deleteItem = (todoId: number) => {
    setLoading(true);
    setActiveItemId(todo.id);
    todosServise.deleteTodos(todoId)
      .then(() => {
        setTodos(todos.filter((t) => t.id !== todoId));
      })
      .finally(() => {
        setLoading(false);
        setActiveItemId(0);
      })
      .catch(() => setErrorMessage('Unable to delete a todo'));
  };

  const completedTodo = () => {
    const updatedTodo = {
      ...todo,
      completed: !todo.completed,
    };

    todosServise.patchTodos(updatedTodo)
      .then(() => {
        setTodos((currentTodos) => {
          const updatedTodos = currentTodos.map((t) => {
            if (t.id === updatedTodo.id) {
              return updatedTodo;
            }

            return t;
          });

          return updatedTodos;
        });
      })
      .catch(() => {
        setErrorMessage('');
      });
  };

  return (
    <>
      <div
        data-cy="Todo"
        className={cn(
          'todo',
          { completed: todo.completed },
        )}
      >
        <label className="todo__status-label">
          <input
            data-cy="TodoStatus"
            type="checkbox"
            className="todo__status"
            onClick={() => completedTodo()}
            defaultChecked={todo.completed}
          />
        </label>

        <span data-cy="TodoTitle" className="todo__title">
          {todo.title}
        </span>

        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDelete"
          onClick={() => deleteItem(todo.id)}
        >
          ×
        </button>

        <div
          data-cy="TodoLoader"
          className={cn(
            'modal overlay',
            {
              'is-active': (loading && todo.id === activeItemId)
              || (isLoading),
            },
          )}
        >
          <div className="modal-background has-background-white-ter" />
          <div className="loader" />
        </div>
      </div>
    </>
  );
};
