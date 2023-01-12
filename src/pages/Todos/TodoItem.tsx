import {
  FC, useState, useRef, useEffect, KeyboardEvent, ChangeEvent, useMemo,
} from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../hooks/useRedux';
import Todo from '../../models/Todo';
import TodosAsync from '../../store/todos/todosAsync';
import { selectLoadingTodosIds } from '../../store/todos/todosSelectors';

type Props = {
  todo: Todo;
};

const TodoItem:FC<Props> = ({ todo }) => {
  const dispatch = useAppDispatch();

  const ref = useRef<HTMLInputElement | null>(null);

  const loadingTodosIds = useSelector(selectLoadingTodosIds);

  const [loading, setLoading] = useState<boolean>(false);
  const isLoading = useMemo(() => (
    loading || loadingTodosIds.includes(todo.id)
  ), [loading, loadingTodosIds]);

  const [editState, setEditState] = useState<boolean>(false);
  const handleEditState = () => setEditState((prev:boolean) => !prev);

  const [title, setTitle] = useState<string>(todo.title);
  const handleTitle = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;

    setTitle(value);
  };

  useEffect(() => {
    if (editState) {
      ref.current?.focus();
    }
  }, [editState]);

  const handleChangeTitle = () => {
    if (!title) {
      handleEditState();
      setTitle(todo.title);
    } else {
      setLoading(true);
      dispatch(TodosAsync.updateTodo({ id: todo.id, title }))
        .unwrap()
        .then(() => handleEditState())
        .finally(() => setLoading(false));
    }
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleEditState();
    }

    if (e.key === 'Enter') {
      handleChangeTitle();
    }
  };

  const handleChangeStatus = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    setLoading(true);
    dispatch(TodosAsync.updateTodo({ id: todo.id, completed: !todo.completed }))
      .unwrap()
      .finally(() => setLoading(false));
  };

  const handleRemoveTodo = () => {
    setLoading(true);
    dispatch(TodosAsync.deleteTodo(todo.id))
      .unwrap()
      .finally(() => setLoading(false));
  };

  return (
    <div data-cy="Todo" className={`todo ${todo.completed ? 'completed' : ''}`} onDoubleClick={handleEditState}>
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todo.completed}
          onChange={handleChangeStatus}
        />
      </label>

      {editState ? (
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            ref={ref}
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={title}
            onChange={handleTitle}
            onBlur={() => {
              handleEditState();
              setTitle(todo.title);
            }}
            onKeyDown={onKeyDown}
          />
        </form>
      ) : (
        <>
          <span data-cy="TodoTitle" className="todo__title">{todo.title}</span>
          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDeleteButton"
            onClick={handleRemoveTodo}
          >
            ×
          </button>
        </>
      )}

      <div data-cy="TodoLoader" className={`modal overlay ${isLoading ? 'is-active' : ''}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
