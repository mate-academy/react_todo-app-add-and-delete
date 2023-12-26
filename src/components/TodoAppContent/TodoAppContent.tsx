import React, {
  useState,
  useEffect,
  useRef,
} from 'react';
import cn from 'classnames';
import { Todo } from '../../types/Todo';
import {
  getTodos,
  addTodo,
  deleteTodo,
} from '../../api/todos';
import { useAuth } from '../../Context/Context';
import { TodoItem } from '../TodoItem';
import { Filter } from '../Filter';
import { filteredData } from '../../helpers/filteredData';
import { FilterBy, ErrorMessage } from '../../types/types';
import { Error } from '../Error';

export const TodoAppContent: React.FC = () => {
  const userId = useAuth();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoField, setNewTodoField] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [todosCount, setTodosCount] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [loadTodosIds, setLoadTodosIds] = useState<number[]>([]);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const currentTodos = filteredData<Todo>(todos, filterBy);

  const inputRef = useRef<HTMLInputElement>(null);

  const isClearDisabled = !todos.some(({ completed }) => completed);
  const countOfNotCompleted = todos
    .filter(({ completed }) => !completed);

  useEffect(() => {
    if (userId) {
      getTodos(userId)
        .then((resp) => {
          setTodos(resp);
        })
        .catch(() => setErrorMessage(ErrorMessage.Load));
    }
  }, [userId]);

  useEffect(() => {
    setTodosCount(countOfNotCompleted.length);
  }, [countOfNotCompleted]);

  useEffect(() => {
    if (!isAdding) {
      inputRef.current?.focus();
    }
  }, [isAdding]);

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userId) {
      if (!newTodoField.trim()) {
        setErrorMessage(ErrorMessage.NotBeEmpty);

        return;
      }

      const body = {
        id: 0,
        title: newTodoField.replace(/\s+/g, ' ').trim(),
        userId,
        completed: false,
      };

      setIsAdding(true);
      setTempTodo(body);

      addTodo(body)
        .then(resp => {
          setTodos(prev => [...prev, resp]);
          setNewTodoField('');
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.Add);
        })
        .finally(() => {
          setTempTodo(null);
          setIsAdding(false);
        });
    }
  };

  const handleDeleteTodo = (idToDelete: number) => {
    setLoadTodosIds(prev => [...prev, idToDelete]);

    deleteTodo(idToDelete)
      .then(() => {
        setTodos(prev => prev.filter(({ id }) => id !== idToDelete));
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      })
      .finally(() => {
        setLoadTodosIds(prev => prev.filter(i => i !== idToDelete));
      });
  };

  const handleClearCompleted = () => {
    todos.forEach(({ id, completed }) => {
      if (completed) {
        handleDeleteTodo(id);
      }
    });
  };

  return (
    <>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={cn(
              'todoapp__toggle-all',
              { active: todosCount === 0 },
            )}
            data-cy="ToggleAllButton"
            aria-label="toggle all button"
          />

          <form onSubmit={handleAddTodo}>
            <input
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              onChange={e => setNewTodoField(e.target.value)}
              value={newTodoField}
              disabled={isAdding}
              ref={inputRef}
            />
          </form>
        </header>

        {((currentTodos.length > 0) || isAdding) && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {currentTodos.map(todo => (
                <TodoItem
                  todo={todo}
                  onDelete={handleDeleteTodo}
                  isLoading={loadTodosIds.includes(todo.id)}
                  key={todo.id}
                />
              ))}

              {tempTodo && (
                <TodoItem
                  todo={tempTodo}
                  isLoading
                />
              )}
            </section>

            <footer className="todoapp__footer" data-cy="Footer">
              <span className="todo-count" data-cy="TodosCounter">
                {`${todosCount} items left`}
              </span>

              <Filter getFilter={setFilterBy} />

              <button
                type="button"
                className="todoapp__clear-completed"
                data-cy="ClearCompletedButton"
                onClick={handleClearCompleted}
                disabled={isClearDisabled}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <Error
        errorMessage={errorMessage}
        setErrorMessage={setErrorMessage}
      />
    </>
  );
};
