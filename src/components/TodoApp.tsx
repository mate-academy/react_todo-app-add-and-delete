import React, { useContext, useEffect, useMemo, useState } from 'react';
import { TodosContext } from './TodosContext';
import { TodoList } from './TodoList';
import { TodosFilter } from './TodosFilter';
import { USER_ID, addTodo } from '../api/todos';
import classNames from 'classnames';
import { Todo } from '../types/Todo';
import { TodoItem } from './TodoItem';

export const TodoApp: React.FC = () => {
  const context = useContext(TodosContext);
  const { todos, toggleAll, addTodoToState, handleDeleteCompleted } = context;
  const { setErrorMessage, setError, titleField } = context;
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');

  useEffect(() => {
    if (titleField && titleField.current) {
      titleField.current.focus();
    }
  }, [titleField]);

  const todosUncompleteLength = useMemo(() => {
    return todos.filter(todo => !todo.completed).length;
  }, [todos]);
  const todosCompletedAtLeastOne = useMemo(() => {
    return todos.some(todo => todo.completed);
  }, [todos]);

  const todosCompletedAll = useMemo(() => {
    return todos.every(todo => todo.completed);
  }, [todos]);

  const handleTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage('');

    if (title.trim().length) {
      if (titleField && titleField.current) {
        titleField.current.disabled = true;
      }

      const newTodo = {
        title: title.trim(),
        completed: false,
        userId: USER_ID,
      };

      setTempTodo({
        id: 0,
        ...newTodo,
      });

      addTodo(newTodo)
        .then(todo => {
          addTodoToState({
            ...todo,
          });
          setTempTodo(null);
          setTitle('');
        })
        .catch(() => {
          setError('Unable to add a todo');
        })
        .finally(() => {
          if (titleField && titleField.current) {
            titleField.current.disabled = false;
            titleField.current.focus();
            setTempTodo(null);
          }
        });
    } else {
      setError('Title should not be empty');
    }
  };

  return (
    <>
      <header className="todoapp__header">
        {!!todos.length && (
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todosCompletedAll,
            })}
            data-cy="ToggleAllButton"
            onClick={toggleAll}
          />
        )}

        <form onSubmit={handleSubmit}>
          <input
            ref={titleField}
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={title}
            onChange={handleTitle}
          />
        </form>
      </header>
      <section className="todoapp__main" data-cy="TodoList">
        <TodoList />
        {tempTodo && <TodoItem todo={tempTodo} temp={true} />}
      </section>

      {!!todos.length && (
        <footer className="todoapp__footer" data-cy="Footer">
          <span className="todo-count" data-cy="TodosCounter">
            {todosUncompleteLength} items left
          </span>

          <TodosFilter />

          <button
            type="button"
            className="todoapp__clear-completed"
            data-cy="ClearCompletedButton"
            onClick={handleDeleteCompleted}
            disabled={!todosCompletedAtLeastOne}
          >
            Clear completed
          </button>
        </footer>
      )}
    </>
  );
};
