import { useContext, useEffect, useRef, useState } from 'react';
import { Todo } from '../types/Todo';
import { deleteTodo, updateTodo } from '../api/todos';
import { TodosContext } from '../TodosContext';
import React from 'react';

interface Props {
  todo: Todo;
  onEditMode: (value: boolean) => void;
  setLoading: (value: boolean) => void;
}

export const EditForm: React.FC<Props> = ({ todo, onEditMode, setLoading }) => {
  const [newTitle, setNewTitle] = useState(todo.title);
  const { setTodos, setErrorMessage } = useContext(TodosContext);

  const editInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    editInput.current?.focus();
  }, []);

  const onSubmit = () => {
    if (newTitle.trim() === todo.title) {
      onEditMode(false);

      return;
    }

    if (newTitle.trim() === '') {
      setLoading(true);
      deleteTodo(todo.id)
        .then(() => {
          setTodos(prev => prev.filter(t => t.id !== todo.id));
          onEditMode(false);
        })
        .catch(() => setErrorMessage('Unable to delete a todo'))
        .finally(() => setLoading(false));

      return;
    }

    setLoading(true);
    updateTodo({
      id: todo.id,
      completed: todo.completed,
      title: newTitle.trim(),
    })
      .then(newTodo => {
        setTodos(prev =>
          prev.map(t => {
            if (t.id === newTodo.id) {
              return newTodo;
            }

            return t;
          }),
        );
        onEditMode(false);
      })
      .catch(() => setErrorMessage('Unable to update a todo'))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  const handleKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      onEditMode(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        ref={editInput}
        data-cy="TodoTitleField"
        type="text"
        className="todo__title-field"
        placeholder="Empty todo will be deleted"
        value={newTitle}
        onChange={event => setNewTitle(event.target.value)}
        onBlur={onSubmit}
        onKeyUp={handleKeyUp}
      />
    </form>
  );
};
