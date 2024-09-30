import { useState, useContext, useRef, useEffect } from 'react';
import cn from 'classnames';
import { ErrorContext, FilterContext, InitialTodosContext, TodosContext } from '../store';
import { Todo } from '../types/type';
import { postTodo, USER_ID } from '../api/todos';

export const TodoHeader: React.FC = () => {
  const { todos, dispatch } = useContext(TodosContext);
  const { filter } = useContext(FilterContext);
  const { initialTodos, setInitialTodos } = useContext(InitialTodosContext);
  const { setErrorMessage } = useContext(ErrorContext);
  const [heading, setHeading] = useState<string>('');
  const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const todosIsDone = todos.every(t => t.completed);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [initialTodos.length]);

  const addNewTodo = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      setIsInputDisabled(true);

      if (!heading.trim()) {
        setErrorMessage('Title should not be empty');

        setTimeout(() => {
          setErrorMessage('');
        }, 3000);

        return;
      }

      const newTodo: Todo = {
        id: +new Date(),
        title: heading.trim(),
        userId: USER_ID,
        completed: false,
        isLoading: true,
      };

      dispatch({ type: 'ADD_TEMP_TODO', payload: newTodo });

      try {
        const response = await postTodo({
          userId: newTodo.userId,
          title: newTodo.title,
          completed: newTodo.completed,
        });

        dispatch({ type: 'ADD_TODO', payload: response });

        dispatch({
          type: filter.toUpperCase(),
          payload: [...todos, response],
        });

        setInitialTodos(prevTodos => [...prevTodos, response]);
        setIsInputDisabled(false);
        setHeading('');
      } catch (error) {
        setErrorMessage('Unable to add a todo');
      } finally {
        setTimeout(() => {
          setErrorMessage('');
        }, 3000);
      }
    }
  };

  return (
    <header className="todoapp__header">
      {todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: todosIsDone })}
          data-cy="ToggleAllButton"
        />
      )}

      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={heading}
          onChange={event => setHeading(event.target.value)}
          onKeyPress={addNewTodo}
          ref={inputRef}
          disabled={isInputDisabled}
        />
      </form>
    </header>
  );
};
