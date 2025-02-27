import { useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import { createTodo, updateTodo, USER_ID } from '../../api/todos';
import classNames from 'classnames';

interface Props {
  todos: Todo[];
  isEmpty: boolean;
  setIsAdd: (value: boolean) => void;
  setIsChange: (value: boolean) => void;
  setChangedId: React.Dispatch<React.SetStateAction<number[]>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setErrorMessage: (value: string) => void;
}

export const Header: React.FC<Props> = ({
  todos,
  isEmpty,
  setIsAdd,
  setIsChange,
  setChangedId,
  setTodos,
  setErrorMessage,
}) => {
  const [title, setTitle] = useState('');
  const inputFocus = useRef<HTMLInputElement>(null);

  const handleFocusInput = () => {
    inputFocus.current?.focus();
  };

  const hadleBlurInput = () => {
    inputFocus.current?.blur();
  };

  useEffect(() => {
    handleFocusInput();
    if (isEmpty) {
      handleFocusInput();
    }
  }, [isEmpty]);

  const handleSwitchTodos = async () => {
    const active = !todos.every(todo => todo.completed);

    setTodos(prevTodos => {
      setIsChange(true);

      return prevTodos.map(todo => {
        const newTodo = { ...todo, completed: active };

        if (newTodo.completed !== todo.completed) {
          setChangedId(prevIds => [...prevIds, todo.id]);

          updateTodo(todo.id, newTodo)
            .catch(() => setErrorMessage('Unable to update todo'))
            .finally(() => {
              setIsChange(false);
              setChangedId(prevIds => prevIds.filter(id => id !== todo.id));
            });

          return newTodo;
        } else {
          return todo;
        }
      });
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    hadleBlurInput();

    if (title.trim()) {
      const todoWithoutId = {
        title,
        completed: false,
        userId: USER_ID,
      };

      const localTodo = { ...todoWithoutId, id: USER_ID };

      setIsAdd(true);
      
      setTodos(prevTodos => [...prevTodos, localTodo]);

      createTodo(todoWithoutId)
        .then(newTodo => {
          setTodos(prevTodos =>
            prevTodos.filter(todo => todo.id !== USER_ID).concat(newTodo),
          );
        })
        .catch(() => {
          setErrorMessage('Unable to add a todo');
        })
        .finally(() => {
          setIsAdd(false);
          handleFocusInput();
        });
    } else {
      setErrorMessage('Title should not be empty');
    }

    setTitle('');
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: todos.every(todo => todo.completed === true),
          })}
          data-cy="ToggleAllButton"
          onClick={handleSwitchTodos}
        />
      )}

      <form onSubmit={e => handleSubmit(e)}>
        <input
          ref={inputFocus}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          onChange={text => setTitle(text.target.value)}
          value={title}
        />
      </form>
    </header>
  );
};
