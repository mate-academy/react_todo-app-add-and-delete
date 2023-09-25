import
React,
{
  useContext,
  useEffect,
  useRef,
  useState,
}
  from 'react';
import classNames from 'classnames';
import { Todo } from '../../types/Todo';
import { getActiveTodoQuantity } from '../TodoFooter/helpers';
import { TodosContext } from '../../contexts/TodosContext';

interface Props {
  todos: Todo[]
}

export const Header: React.FC<Props> = ({ todos }) => {
  const [todoTitle, setTodoTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { handleAddTodo, errorMessage } = useContext(TodosContext);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTodoTitle(event.target.value);
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [todos, errorMessage, isLoading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    const response = await handleAddTodo(todoTitle);

    if (response) {
      setTodoTitle('');
    }

    setIsLoading(false);
  };

  return (
    <header className="todoapp__header">
      {Boolean(todos.length) && (
        <button
          type="button"
          className={classNames(
            'todoapp__toggle-all',
            { active: getActiveTodoQuantity(todos) === 0 },
          )}
          id="button-togle"
          data-cy="ToggleAllButton"
          aria-label="Toogle All"
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={todoTitle}
          onChange={handleInputChange}
          disabled={isLoading}
        />
      </form>
    </header>
  );
};
