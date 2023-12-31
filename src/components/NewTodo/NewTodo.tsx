import { FC, useState } from 'react';
import { Todo } from '../../types/Todo';
import { Errors } from '../../types/ErrorTypes';

function getId(todos: Todo[]):number {
  return todos.reduce((max, todo) => Math.max(todo.id, max), 0) + 1;
}

type Props = {
  onAdd: (todo: Todo) => void,
  todos: Todo[],
  userId: number,
  setErrorMsg: (errorMsg: Errors | null) => void,
};

export const NewTodo: FC<Props> = (
  {
    onAdd, todos, userId, setErrorMsg,
  },
) => {
  const [inputTitle, setInputTitle] = useState('');

  const addTodo = (title: string) => {
    const todo: Todo = {
      id: getId(todos),
      userId,
      title,
      completed: false,
    };

    onAdd(todo);
  };

  function handleKeyPressed(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter') {
      event.preventDefault();
      if (inputTitle.trim() === '') {
        setErrorMsg(Errors.title);

        return;
      }

      setErrorMsg(null);
      try {
        addTodo(inputTitle);
        setInputTitle('');
      } catch {
        setErrorMsg(Errors.add);
      }
    }
  }

  function handleTodoField(event: React.ChangeEvent<HTMLInputElement>) {
    setInputTitle(event.target.value);
  }

  return (
    <form>
      <input
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={inputTitle}
        onKeyDown={(event) => handleKeyPressed(event)}
        onChange={handleTodoField}
      />
    </form>
  );
};
