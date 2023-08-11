import { Dispatch, SetStateAction, useState } from 'react';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/error';

/* eslint-disable jsx-a11y/control-has-associated-label */
type Props = {
  todos: Todo[]
  addTodo: (newTodo: Omit<Todo, 'id'>) => void
  setErrorMessage: (message: ErrorType) => void
  setNotifcation: Dispatch<SetStateAction<boolean>>
};

const USER_ID = 11299;

export const TodoApp:React.FC<Props> = ({
  todos,
  addTodo,
  setErrorMessage,
  setNotifcation,
}) => {
  const [newTitle, setNewTitle] = useState('');

  const handerInputTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewTitle(event.target.value);
  };

  const hanldlerEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (newTitle.trim()) {
        addTodo({
          userId: USER_ID,
          title: newTitle,
          completed: false,
        });
        setNewTitle('');
      } else {
        setErrorMessage(ErrorType.Empty);
        setNotifcation(true);
      }
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className="todoapp__toggle-all active"
        />
      )}
      <form onSubmit={e => e.preventDefault()}>
        <input
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={handerInputTitle}
          onKeyDown={hanldlerEnter}
        />
      </form>
    </header>
  );
};

export default TodoApp;
