import {
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { addTodos } from '../api/todos';
import { Error } from '../types/Error';
import { createTodo } from '../utils/createTodo';
import { TodosContext } from './TodosContext';

type Props = {
  setTempTodo: (val: Todo | null) => void,
};

export const TodosHeader: React.FC<Props> = ({ setTempTodo }) => {
  const { todos, setTodos, setErrorMessage } = useContext(TodosContext);
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
        .then((savedTodo) => {
          setTodos([...todos, savedTodo]);
          setNewTitle('');
        }).catch(() => setErrorMessage(Error.post))
        .finally(() => {
          setIsPosting(false);
          setTempTodo(null);
        });

      return;
    }

    setErrorMessage(Error.submit);
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
