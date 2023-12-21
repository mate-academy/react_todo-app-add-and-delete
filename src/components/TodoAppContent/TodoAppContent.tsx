import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import { Todo } from '../../types/Todo';
import { getTodos, addTodo, deleteTodo } from '../../api/todos';
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
  const [isDisabledInput, setIsDisabledInput] = useState(false);
  const [todosCount, setTodosCount] = useState(0);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [filterBy, setFilterBy] = useState<FilterBy>(FilterBy.All);
  const [disabledClear, setDisabledClear] = useState(true);
  const [errorMessage, setErrorMessage] = useState<ErrorMessage | null>(null);
  const currentTodos = filteredData<Todo>(todos, filterBy);

  const inputRef = useRef<HTMLInputElement>(null);

  const countOfNotCompleted = (arr: Todo[]): number => {
    return arr.filter(({ completed }) => !completed).length;
  };

  useEffect(() => {
    if (userId) {
      getTodos(userId)
        .then((resp) => {
          setTodos(resp);
          setTodosCount(countOfNotCompleted(resp));
        })
        .catch(() => setErrorMessage(ErrorMessage.Load));
    }
  }, [userId]);

  useEffect(() => {
    if (!isDisabledInput) {
      inputRef.current?.focus();
    }
  }, [isDisabledInput]);

  useMemo(() => {
    setDisabledClear(!todos.some(({ completed }) => completed));
  }, [todos]);

  const handleAddTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (userId) {
      if (!newTodoField.trim()) {
        setErrorMessage(ErrorMessage.NotBeEmpty);

        return;
      }

      const body = {
        id: 0,
        title: newTodoField,
        userId,
        completed: false,
      };

      setTempTodo(body);
      setIsDisabledInput(true);

      addTodo(body)
        .then(resp => {
          setTodos(prev => [...prev, resp]);
          setTodosCount(prev => prev + 1);
          setNewTodoField('');
        })
        .catch(() => {
          setErrorMessage(ErrorMessage.Add);
        })
        .finally(() => {
          setTempTodo(null);
          setIsDisabledInput(false);
        });
    }
  };

  const handleDeleteTodo = (idToDel: number, doNotCount = false) => {
    deleteTodo(idToDel)
      .then(() => {
        setTodos(prev => prev.filter(({ id }) => id !== idToDel));
        if (!doNotCount) {
          setTodosCount(prev => prev - 1);
        }
      })
      .catch(() => {
        setErrorMessage(ErrorMessage.Delete);
      });
  };

  const handleClearCompleted = () => {
    todos.forEach(({ id, completed }) => {
      if (completed) {
        handleDeleteTodo(id, true);
      }
    });
  };

  return (
    <>
      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className="todoapp__toggle-all"
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
              disabled={isDisabledInput}
              ref={inputRef}
            />
          </form>
        </header>

        {currentTodos.length > 0 && (
          <>
            <section className="todoapp__main" data-cy="TodoList">
              {currentTodos.map(todo => (
                <TodoItem
                  todo={todo}
                  onDelete={handleDeleteTodo}
                  key={todo.id}
                />
              ))}

              {tempTodo && <TodoItem todo={tempTodo} isLoading />}
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
                disabled={disabledClear}
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
