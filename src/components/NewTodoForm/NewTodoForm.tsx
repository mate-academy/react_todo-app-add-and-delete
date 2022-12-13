import React, {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { TodoData } from '../../api/todos';
import { ErrorTypes } from '../../types/ErrorTypes';
import { AuthContext } from '../Auth/AuthContext';

interface Props {
  onAdd: (todo: TodoData) => void,
  isAdding: boolean,
  onError: (error: ErrorTypes) => void,
  onHiddenChange: (isHidden: boolean) => void,
}

export const NewTodoForm: React.FC<Props> = ({
  onAdd,
  isAdding,
  onError,
  onHiddenChange,
}) => {
  const user = useContext(AuthContext);
  const newTodoField = useRef<HTMLInputElement>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');

  useEffect(() => {
    if (newTodoField.current) {
      newTodoField.current.focus();
    }
  }, []);

  useEffect(() => {
    if (newTodoField.current && !isAdding) {
      newTodoField.current.focus();
    }
  }, [isAdding]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (newTodoTitle.trim()) {
      const newTodo = {
        title: newTodoTitle.trim(),
        completed: false,
        userId: user?.id,
      };

      onAdd(newTodo);
      setNewTodoTitle('');
    } else {
      onError(ErrorTypes.EmptyTitle);
      onHiddenChange(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          ref={newTodoField}
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTodoTitle}
          onChange={(event) => {
            setNewTodoTitle(event.target.value);
          }}
          disabled={isAdding}
        />
      </form>
    </>
  );
};
