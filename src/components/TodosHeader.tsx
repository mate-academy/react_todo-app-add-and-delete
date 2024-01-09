import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { addTodos } from '../api/todos';
import { Error } from '../types/Error';
import { createTodo } from '../utils/createTodo';

type Props = {
  todos: Todo[],
  setTodos: (val: Todo[]) => void,
  setTempTodo: (val: Todo | null) => void,
  onError: (val: string) => void,
};

export const TodosHeader: React.FC<Props> = ({
  todos,
  setTodos,
  setTempTodo,
  onError,
}) => {
  const [newTitle, setNewTitle] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const todoInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (todoInput.current) {
      todoInput.current.focus();
    }
  });

  const handleSubmit = () => {
    if (newTitle.trim()) {
      const newTodo = createTodo(newTitle);
      const { userId, title, completed } = newTodo;

      setIsPosting(true);
      setTempTodo(newTodo);

      addTodos({ userId, title, completed })
        .then(savedTodo => setTodos([...todos, savedTodo]))
        .then(() => setNewTitle(''))
        .catch(() => onError(Error.post))
        .finally(() => {
          setIsPosting(false);
          setTempTodo(null);
        });

      return;
    }

    onError(Error.submit);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: false })}
        data-cy="ToggleAllButton"
        aria-label="ToggleAll"
      />

      <form>
        <input
          ref={todoInput}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()}
          onKeyUp={(e) => e.key === 'Enter' && handleSubmit()}
          disabled={isPosting}
        />
      </form>
    </header>
  );
};
