import { createTodo, USER_ID } from '../../api/todos';
import { Todo } from '../../types/Todo';
import { useEffect, useRef, useState } from 'react';
import { updateTodoStatus } from '../../api/todos';

type Prop = {
  todos: Todo[];
  isAllTodoCompleted: boolean;
  addTodo: string;
  setTitleError: React.Dispatch<React.SetStateAction<string>>;
  setAddTodo: React.Dispatch<React.SetStateAction<string>>;
  setActionError: React.Dispatch<React.SetStateAction<string>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setTempTodo: React.Dispatch<React.SetStateAction<Todo | null>>;
};

export const NewTodo: React.FC<Prop> = ({
  todos,
  isAllTodoCompleted,
  addTodo,
  setTitleError,
  setAddTodo,
  setActionError,
  setTodos,
  setTempTodo,
}) => {
  const [addStatus, setAddStatus] = useState(false);
  const inputFocus = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (inputFocus.current) {
      inputFocus.current.focus();
    }
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (addTodo.trim().length === 0) {
      setTitleError('Title should not be empty');

      setTimeout(() => {
        setTitleError('');
      }, 3000);

      return;
    }

    const temp: Todo = {
      userId: USER_ID,
      id: (Date.now() % 10000) + Math.floor(Math.random() * 10),
      title: addTodo.trim(),
      completed: false,
    };

    setTempTodo(temp);
    setAddStatus(true);
    createTodo(addTodo.trim())
      .then(addedTodo => {
        setTodos(prevTodos => [...prevTodos, addedTodo]);
        setAddTodo('');
      })
      .catch(() => {
        setActionError('Add');
      })
      .finally(() => {
        setAddStatus(false);
        setTempTodo(null);
      });

    setTimeout(() => {
      setActionError('');
    }, 3000);
  };

  const handleMakeTodosActive = (event: React.MouseEvent) => {
    if (!isAllTodoCompleted) {
      event.preventDefault();
    } else {
      todos.forEach(updateTodo => {
        updateTodoStatus(updateTodo)
          .then(updatedTodo => {
            setTodos(prevTodos =>
              prevTodos.map(todo =>
                todo.id === updatedTodo.id ? updatedTodo : todo,
              ),
            );
          })
          .catch(() => {
            setActionError('update');
          })
          .finally();
        setTimeout(() => {
          setActionError('');
        }, 3000);
      });
    }
  };

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={
          isAllTodoCompleted
            ? 'todoapp__toggle-all active'
            : 'todoapp__toggle-all'
        }
        data-cy="ToggleAllButton"
        onClick={event => handleMakeTodosActive(event)}
      />

      {/* Add a todo on form submit */}
      <form onSubmit={event => handleSubmit(event)}>
        <input
          ref={inputFocus}
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={addTodo}
          onChange={event => setAddTodo(event.target.value)}
          disabled={addStatus}
        />
      </form>
    </header>
  );
};
