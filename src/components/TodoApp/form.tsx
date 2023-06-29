import { useState } from 'react';
import { addTodo } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { ErrorType } from '../../types/Error';
import { USER_ID } from './consts';

type Props = {
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  onError: (error: ErrorType) => void,
};

export const Form: React.FC<Props> = ({
  setTodos,
  onError: setErrorType,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  const addTodoHandler = () => {
    addTodo(USER_ID, newTodoTitle)
      .then((newTodo) => {
        setTodos((prevTodos) => [...prevTodos, newTodo]);
      })
      .catch(() => setErrorType(ErrorType.ADD))
      .finally(() => {
        setNewTodoTitle('');
      });
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      addTodoHandler();
    }}
    >
      <input
        name="title"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={newTodoTitle}
        onChange={(e) => setNewTodoTitle(e.target.value)}
      />
    </form>
  );
};
