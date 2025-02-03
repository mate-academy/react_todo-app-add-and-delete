import cn from 'classnames';
import { Todo } from '../../types/Todo';
import { useState } from 'react';

type Props = {
  listOfTodos: Todo[];
  onUpdate: (todo: Todo) => void;
  isSavingAll: boolean;
  onDelete: (todoId: number) => void;
  savingTodoIds: number[];
};

export const TodoList: React.FC<Props> = ({
  listOfTodos,
  onUpdate,
  isSavingAll,
  onDelete,
  savingTodoIds,
}) => {
  const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
  const [value, setValue] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleTodoEdit = (todo: Todo) => {
    setEditingTodoId(todo.id);
    setValue(todo.title);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  const handleTodoChange = (
    { key, val }: { key: keyof Todo; val: Todo[keyof Todo] },
    todo: Todo,
  ) => {
    const updatedTodo: Todo = {
      ...todo,
      [key]: val,
    };

    onUpdate(updatedTodo);
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    todo: Todo,
  ) => {
    if (event.key === 'Enter') {
      setIsDisabled(true);
      if (value === '') {
        onDelete(todo.id);

        return;
      }

      onUpdate({ ...todo, title: value.trim() });
      setEditingTodoId(null);
      setIsDisabled(false);
    }
  };

  const handleBlur = () => {
    setEditingTodoId(null);
  };

  const handleDelieteTodo = (id: number) => {
    onDelete(id);
  };

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {listOfTodos.map(todo => {
        const isSaving = savingTodoIds.includes(todo.id);

        return (
          <div
            key={todo.id}
            data-cy="Todo"
            className={cn('todo', { completed: todo.completed })}
          >
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="todo__status-label">
              <input
                data-cy="TodoStatus"
                type="checkbox"
                className="todo__status"
                checked={todo.completed}
                onChange={() =>
                  handleTodoChange(
                    { key: 'completed', val: !todo.completed },
                    todo,
                  )
                }
              />
            </label>

            {editingTodoId === todo.id ? (
              <form onSubmit={e => e.preventDefault()}>
                <input
                  data-cy="TodoTitleField"
                  type="text"
                  className="todo__title-field"
                  placeholder="Empty todo will be deleted"
                  value={value}
                  onChange={handleChange}
                  onKeyDown={event => handleKeyDown(event, todo)}
                  onBlur={handleBlur}
                  disabled={isDisabled}
                  autoFocus
                />
              </form>
            ) : (
              <>
                {' '}
                <span
                  data-cy="TodoTitle"
                  className="todo__title"
                  onDoubleClick={() => handleTodoEdit(todo)}
                >
                  {todo.title}
                </span>
                <button
                  type="button"
                  className="todo__remove"
                  data-cy="TodoDelete"
                  onClick={() => handleDelieteTodo(todo.id)}
                >
                  ×
                </button>
              </>
            )}
            <div
              data-cy="TodoLoader"
              className={cn('modal overlay', {
                'is-active': isSavingAll || isSaving,
              })}
            >
              <div className="modal-background has-background-white-ter" />
              <div className="loader" />
            </div>
          </div>
        );
      })}
    </section>
  );
};
