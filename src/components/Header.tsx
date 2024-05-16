import { useEffect, useState } from 'react';
import { Todo } from '../types/Todo';
import { USER_ID, postTodo } from '../api/todos';
import classNames from 'classnames';

type Props = {
  todos: Todo[];
  onAdd: React.Dispatch<React.SetStateAction<Todo[]>>;
  onError: (error: string) => void;
  onTemp: (tempTodo: Todo | null) => void;
  mainRef: React.RefObject<HTMLInputElement>;
};

export const Header: React.FC<Props> = ({
  todos,
  onAdd,
  onError,
  onTemp,
  mainRef,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const [isAllCompleted, setIsAllCompleted] = useState(() =>
    todos.every(todo => todo.completed),
  );

  useEffect(() => {
    if (todos.every(todo => todo.completed)) {
      setIsAllCompleted(false);
    } else {
      setIsAllCompleted(true);
    }
  }, [todos]);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.focus();
    }
  }, [isAddingTodo, mainRef]);

  const addTodo = (event: React.FormEvent) => {
    event.preventDefault();
    onError('');

    if (!inputValue.trim()) {
      onError('Title should not be empty');
      setTimeout(() => onError(''), 3000);

      return;
    }

    const todoData: Omit<Todo, 'id'> = {
      title: inputValue.trim(),
      completed: false,
      userId: USER_ID,
    };

    setIsAddingTodo(true);
    onTemp({
      id: 0,
      title: inputValue.trim(),
      completed: false,
      userId: USER_ID,
    });
    postTodo(todoData)
      .then(newTodo => {
        onAdd(prevTodos => [...prevTodos, newTodo]);
        setInputValue('');
      })
      .catch(error => {
        onError('Unable to add a todo');
        throw error;
      })
      .finally(() => {
        setIsAddingTodo(false);
        onTemp(null);
        setTimeout(() => onError(''), 3000);
      });
  };

  const toggleAll = () => {
    const toggledTodos = todos.map(todo => {
      const currentTodo = { ...todo };

      currentTodo.completed = isAllCompleted;

      return currentTodo;
    });

    onAdd(toggledTodos);
    setIsAllCompleted(!isAllCompleted);
  };

  return (
    <header className="todoapp__header">
      <button
        type="button"
        data-cy="ToggleAllButton"
        className={classNames('todoapp__toggle-all', {
          active: !isAllCompleted,
        })}
        onClick={toggleAll}
      />

      <form onSubmit={addTodo}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={event => setInputValue(event.target.value)}
          ref={mainRef}
          disabled={isAddingTodo}
        />
      </form>
    </header>
  );
};
