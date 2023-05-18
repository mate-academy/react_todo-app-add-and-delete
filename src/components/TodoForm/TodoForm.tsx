import React, { useCallback, useState } from 'react';
import { USER_ID } from '../../App.constants';
import { TodoData } from '../../types/TodoData';
import { Todo } from '../../types/Todo';
import { createTodo } from '../../api/todos';

interface Props {
  addTodo: (newTodo: Todo) => void;
  setErrorMessage: (errorMessage: string) => void;
  setTempTodo: (newTodo: Todo | null) => void;
}

export const TodoForm: React.FC<Props> = ({
  addTodo,
  setErrorMessage,
  setTempTodo,
}) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title) {
      setErrorMessage('Title can\'t be empty');

      return;
    }

    const todoData: TodoData = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setTempTodo({ ...todoData, id: 0 });

    try {
      setIsDisabled(true);
      const newTodo = await createTodo(todoData);

      addTodo(newTodo);
      setTitle('');
    } catch {
      setErrorMessage('Unable to add todo');
    } finally {
      setTempTodo(null);
      setIsDisabled(false);
    }
  }, [title]);

  return (
    <form
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={event => {
          setTitle(event.target.value);
          setErrorMessage('');
        }}
        disabled={isDisabled}
      />
    </form>
  );
};
