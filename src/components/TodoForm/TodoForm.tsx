import React, { FC, memo, useCallback, useState } from 'react';
import { Todo } from '../../types/Todo';
import { TodoData } from '../../types/TodoData'
import { ErrorsType } from '../../types/ErrorsType'

interface Props {
  addTodo: (newTodo: Todo) => void,
  setTempTodo: (newTodo: Todo | null) => void,
  displayError: (message: string) => void,
}

export const TodoForm: FC<Props> = memo(({
  addTodo,
  setTempTodo,
  displayError
})) => {
  const [title, setTitle] = useState('');
  const [isDisabled, setIsDisabled] = useState(false);

  const handleFormSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!title.trim().length) {
        displayError(ErrorsType.EMPTY)
        return;
      }

      displayError(ErrorsType.NONE);

      const todoToAdd: TodoData = {
        title,
        userId: USER_ID,
        completed: false
      };

      setTempTodo({...todoToAdd, id: 0});

      try {
        setIsDisabled(true);
      }
    }
  )
  return (
    <form onSubmit={handleFormSubmit}>
      <input
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        disabled={isDisabled}
      />
    </form>
  );
});
function displayError(EMPTY: ErrorsType) {
  throw new Error('Function not implemented.')
}

function setTempTodo(arg0: { id: number; title: string; userId: number; completed: boolean }) {
  throw new Error('Function not implemented.')
}

