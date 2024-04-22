import cn from 'classnames';
import { useContext, useEffect, useRef } from 'react';
import { patchTodo } from './api/todos';
import { ContextTodos } from './TodoContext';

export const Header = () => {
  const {
    setErrMessage,
    setIsLoading,
    setTodos,
    isLoading,
    handleSubmit,
    newTitle,
    setNewTitle,
    todos,
  } = useContext(ContextTodos);
  const isAllActive = todos.every(todo => todo.completed);

  const selectInputTitle = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectInputTitle.current) {
      selectInputTitle.current.focus();
    }
  }, [isLoading]);

  const handleChangeCompleted = async () => {
    const isEveryTodoCompleted = todos.every(todo => todo.completed);

    try {
      for (const todo of todos) {
        if (todo.completed === !isEveryTodoCompleted) {
          continue;
        }

        setIsLoading(prevState => [...prevState, todo.id]);

        await patchTodo({
          ...todo,
          completed: !isEveryTodoCompleted,
        }).then(respond => {
          setTodos(prevTodos => {
            return prevTodos.map(prevTodo =>
              prevTodo.id === respond.id ? respond : prevTodo,
            );
          });
        });
      }
    } catch {
      setErrMessage('Unable to update a todo');
    } finally {
      setIsLoading([]);
    }
  };

  return (
    <header className="todoapp__header">
      {isLoading.length === 0 && todos.length > 0 && (
        <button
          type="button"
          className={cn('todoapp__toggle-all ', { active: isAllActive })}
          data-cy="ToggleAllButton"
          onClick={handleChangeCompleted}
        />
      )}

      <form onSubmit={handleSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={selectInputTitle}
          value={newTitle}
          disabled={isLoading?.length !== 0}
          onChange={event => setNewTitle(event.target.value)}
        />
      </form>
    </header>
  );
};
