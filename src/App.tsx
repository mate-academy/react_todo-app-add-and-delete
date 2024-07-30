/* eslint-disable max-len */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import * as todoServices from './api/todos';
import { Todo } from './types/Todo';
import { Filters } from './types/Filters';
import { TodoItem } from './components/todoItem';
import { TodoFilter } from './components/todoFilter';
import { ErrorMessage } from './components/errorMessage';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState<Filters>(Filters.All);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const newTodoFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    todoServices
      .getTodos()
      .then(setTodos)
      .catch(() => {
        setErrorMessage('Unable to load todos');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  }, []);

  const filteredTodos = useMemo(() => {
    switch (filter) {
      case Filters.Active:
        return todos.filter(todo => !todo.completed);
      case Filters.Completed:
        return todos.filter(todo => todo.completed);
      case Filters.All:
      default:
        return todos;
    }
  }, [todos, filter]);

  const activeTodosCount = useMemo(() => {
    return todos.reduce(
      (count, todo) => (!todo.completed ? count + 1 : count),
      0,
    );
  }, [todos]);

  useEffect(() => {
    if (newTodoFieldRef.current && !isSubmitting) {
      newTodoFieldRef.current.focus();
    }
  }, [isSubmitting]);

  const handleAddTodo = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const title = newTodoTitle.trim();

    if (!title) {
      setErrorMessage('Title should not be empty');
      setTimeout(() => setErrorMessage(''), 3000);

      return;
    }

    setTempTodo({
      id: 0,
      userId: USER_ID,
      title,
      completed: false,
    });

    setIsSubmitting(true);

    try {
      const newTodo = await todoServices.postTodo(title);

      setTodos(prevTodos => [
        ...prevTodos.filter(todo => todo.id !== 0),
        newTodo,
      ]);
      setNewTodoTitle('');
    } catch {
      setErrorMessage('Unable to add a todo');
      setTimeout(() => setErrorMessage(''), 3000);
    } finally {
      setTempTodo(null);
      setIsSubmitting(false);
      if (newTodoFieldRef.current) {
        newTodoFieldRef.current.focus();
      }
    }
  };

  const handleDeleteTodo = async (todoId: number) => {
    try {
      setTodos(
        todos.map(todo =>
          todo.id === todoId ? { ...todo, isDeleting: true } : todo,
        ),
      );
      await todoServices.deleteTodo(todoId);
      setTodos(todos.filter(todo => todo.id !== todoId));
    } catch {
      setErrorMessage('Unable to delete a todo');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);

    Promise.all(completedTodos.map(todo => todoServices.deleteTodo(todo.id)))
      .then(() => {
        setTodos(prevTodos => prevTodos.filter(todo => !todo.completed));
      })
      .catch(() => {
        setErrorMessage('Unable to delete a todo');
        setTimeout(() => setErrorMessage(''), 3000);
      });
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all active"
            data-cy="ToggleAllButton"
          />

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              value={newTodoTitle}
              onChange={e => setNewTodoTitle(e.target.value)}
              ref={newTodoFieldRef}
              disabled={isSubmitting}
            />
          </form>
        </header>

        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {filteredTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoItem
                  todo={todo}
                  onDelete={() => handleDeleteTodo(todo.id)}
                  onUpdate={todoServices.updateTodo}
                />
              </CSSTransition>
            ))}

            {tempTodo && (
              <CSSTransition
                key={tempTodo.id}
                timeout={300}
                classNames="temp-item"
              >
                <TodoItem todo={tempTodo} isProcessed />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {todos.length > 0 && (
          <TodoFilter
            currentFilter={filter}
            onFilterChange={setFilter}
            todos={todos}
            activeTodosCount={activeTodosCount}
            onClearCompleted={handleClearCompleted}
          />
        )}
      </div>

      <ErrorMessage error={errorMessage} setError={setErrorMessage} />
    </div>
  );
};
