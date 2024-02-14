import {
  FormEventHandler, useEffect, useRef, useState,
} from 'react';
import { addTodo } from '../../api/todos';
import { useTodos } from '../../context/TodoProvider';
import { Todo } from '../../types/Todo';

export const TodoForm = () => {
  const [title, setTitle] = useState('');
  const [addButtonDisabled, setAddButtonDisabled] = useState(false);
  const {
    todos, setTodos, setTempTodo, errorMessage, setErrorMessage,
  } = useTodos();
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, errorMessage]);

  const handleAddTodo: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    setAddButtonDisabled(true);

    const temp = {
      title: title.trim(),
      userId: 12121,
      completed: false,
    };

    if (temp.title.length === 0) {
      setAddButtonDisabled(false);
      setErrorMessage('Title should not be empty');
    } else {
      setTempTodo({ ...temp, id: 0 });

      addTodo(temp)
        .then(todo => setTodos((prev: Todo[]) => ([
          ...prev,
          todo,
        ])))
        .then(() => setTitle(''))
        .catch(() => setErrorMessage('Unable to add a todo'))
        .finally(() => {
          setTempTodo(null);
          setAddButtonDisabled(false);
        });
    }
  };

  return (
    <form onSubmit={handleAddTodo}>
      <input
        onChange={e => setTitle(e.target.value)}
        data-cy="NewTodoField"
        type="text"
        className="todoapp__new-todo"
        placeholder="What needs to be done?"
        value={title}
        ref={inputRef}
        disabled={addButtonDisabled}
      />
    </form>
  );
};
