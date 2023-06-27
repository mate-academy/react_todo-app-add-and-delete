import { useState } from 'react';
import { addTodo } from '../api/todos';
import { Todo } from '../types/Todo';
import { ErrorType } from '../types/Error';

type Props = {
  todos: Todo[],
  setTodos: (todo: Todo[]) => void,
  setErrorType: (error: ErrorType) => void,
  USER_ID: number,
};

export const Form: React.FC<Props> = ({
  todos, setTodos, setErrorType, USER_ID,
}) => {
  const [newTodoTitle, setNewTodoTitle] = useState('');

  return (
    <form onSubmit={(e) => {
      e.preventDefault();

      addTodo(USER_ID, newTodoTitle)
        .then((newTodo) => {
          setTodos([...todos, newTodo]);
        })
        .catch(() => setErrorType(ErrorType.ADD))
        .finally(() => {
          setNewTodoTitle('');
        });
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
