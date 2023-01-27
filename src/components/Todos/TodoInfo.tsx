/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  FC,
  memo,
  useRef,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';

type Props = {
  todo: Todo;
  setTodos: (cb: (tds: Todo[]) => Todo[]) => void;
  setErrors: (ers: string[] | ((prv: string[]) => string[])) => void;
  pending: boolean;
  setPendingTodos: (tdsOrCb: number[] | ((tds: number[]) => number[])) => void;
};

export const TodoInfo: FC<Props> = memo(({
  todo,
  setTodos,
  setErrors,
  pending,
  setPendingTodos,
}) => {
  const [editMode, setEditMode] = useState(false);
  const titleRef = useRef<HTMLInputElement | null>(null);

  const handleClickOutside = useCallback((event: MouseEvent | TouchEvent) => {
    if (titleRef.current
      && !titleRef.current.contains(event.target as Node)
    ) {
      setEditMode(false);
    }
  }, [setEditMode]);

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    };
  }, [handleClickOutside]);

  const lastTitle = titleRef.current?.innerText;

  const addErrorCallback = useCallback((newError: string) => {
    return (prev: string[]) => [
      newError,
      ...prev,
    ];
  }, []);

  const remove = () => {
    setPendingTodos(prev => [...prev, todo.id]);
    deleteTodo(todo.id)
      .then(_ => {
        setTodos(prev => prev.filter(item => item.id !== todo.id));
      })
      .catch(_ => {
        setErrors(addErrorCallback('Unable to delete a todo'));
      }).finally(() => {
        setPendingTodos(prev => prev.filter(id => id !== todo.id));
      });
  };

  const save = () => {
    if (titleRef.current) {
      if (titleRef.current.innerText === lastTitle) {
        return;
      }

      if (!titleRef.current.innerText.length) {
        remove();

        return;
      }

      setPendingTodos(prev => [...prev, todo.id]);
      updateTodo(
        todo.id,
        { title: titleRef.current?.innerText || '' },
      )
        .then(res => {
          setTodos(prev => [...prev.map(item => {
            if (item.id === res.id) {
              return {
                ...item,
                title: titleRef.current?.innerText || '',
              };
            }

            return item;
          })]);
        })
        .catch(_ => {
          setErrors(addErrorCallback('Unable to update a todo'));
        }).finally(() => {
          setPendingTodos(prev => prev.filter(id => id !== todo.id));
        });
    }
  };

  const handleCheckboxClick = () => {
    setPendingTodos(prev => [...prev, todo.id]);
    updateTodo(todo.id, { completed: !todo.completed })
      .then(res => {
        setTodos(prev => [...prev.map(item => {
          if (item.id === res.id) {
            return res as Todo;
          }

          return item;
        })]);
      })
      .catch(_ => {
        setErrors(prev => [
          'Unable to update a todo',
          ...prev,
        ]);
      }).finally(() => {
        setPendingTodos(prev => prev.filter(id => id !== todo.id));
      });
  };

  return (
    <div
      data-cy="Todo"
      className={`todo ${todo.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={todo.completed}
          onChange={handleCheckboxClick}
        />
      </label>

      <span
        data-cy="TodoTitle"
        className="todo__title"
        ref={titleRef}
        onDoubleClick={() => setEditMode(true)}
        role="none"
        contentEditable={editMode}
        onKeyDown={e => {
          if (editMode) {
            if (e.key === 'Enter') {
              save();
              setEditMode(false);
            } else if (e.key === 'Escape') {
              if (titleRef.current && titleRef.current.innerText && lastTitle) {
                titleRef.current.innerText = lastTitle;
              }

              setEditMode(false);
            }
          }
        }}
      >
        {todo.title}
      </span>

      {!editMode && (
        <button
          type="button"
          className="todo__remove"
          data-cy="TodoDeleteButton"
          onClick={() => remove()}
        >
          ×
        </button>
      )}

      <div data-cy="TodoLoader" className={`modal overlay ${pending ? 'is-active' : ''}`}>
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
});
