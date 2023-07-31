/* eslint-disable jsx-a11y/control-has-associated-label */
import cn from 'classnames';
import {
  useContext, useMemo, useRef, useState,
} from 'react';
import { TodoList } from '../TodoList/TodoList';
import { TodosFilter } from '../TodosFilter/TodosFilter';
import { TodoContext } from '../TodoContext/TodoContext';
import { Notification } from '../Notification/Notification';
import { addTodo, deleteTodo } from '../../api/todos';
import { USER_ID } from '../../utils/UserId';
import { Todo } from '../../types/Todo';
import { TodoItem } from '../TodoItem/TodoItem';

export const TodoApp: React.FC = () => {
  const {
    allTodos, todos, setTodos, setError, setLoading,
  } = useContext(TodoContext);

  const [title, setTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<null | Todo>(null);
  const [disabledButton, setDisabledButton] = useState(false);

  const inputRef = useRef<HTMLInputElement | null>(null);

  const idsOfCompletedTodos: number[] = [];

  const handleAddTodo = (event: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault();

    if (title.trim().length === 0) {
      setError('Title can\'t be empty');
      setTitle('');

      return;
    }

    const newTodo = {
      title,
      userId: USER_ID,
      completed: false,
    };

    setDisabledButton(true);
    setTempTodo({ ...newTodo, id: 0 });
    setLoading([0]);

    addTodo(newTodo)
      .then((createdTodo: Todo) => {
        setTodos((currentTodos: Todo[]) => [...currentTodos, createdTodo]);
      })
      .catch(() => setError('Unable to add a todo'))
      .finally(() => {
        setTitle('');
        setDisabledButton(false);
        setTempTodo(null);
        setLoading([]);
        inputRef.current?.focus();
      });
  };

  const completedTodos = useMemo(() => {
    return todos.filter(todo => {
      if (todo.completed) {
        idsOfCompletedTodos.push(todo.id);
      }

      return todo.completed;
    });
  }, [todos]);

  const activeTodos = useMemo(() => {
    return allTodos.filter(todo => !todo.completed);
  }, [allTodos]);

  const deleteCompletedTodos = () => {
    setLoading(idsOfCompletedTodos);

    idsOfCompletedTodos.forEach(id => {
      deleteTodo(id)
        .then(() => {
          setTodos(currentTodos => (
            currentTodos.filter(currTodo => !currTodo.completed)
          ));
        })
        .catch(() => setError('Unable to delete a todos'))
        .finally(() => setLoading([]));
    });
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {/* this buttons is active only if there are some active todos */}
          {activeTodos.length > 0 && (
            <button type="button" className="todoapp__toggle-all active" />
          )}

          {/* Add a todo on form submit */}
          <form onSubmit={(event) => handleAddTodo(event)}>
            <input
              ref={inputRef}
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              disabled={disabledButton}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />
          </form>
        </header>

        {(allTodos.length > 0 || tempTodo) && (
          <>
            <TodoList />

            {tempTodo && <TodoItem todo={tempTodo} />}

            <footer className="todoapp__footer">
              <span className="todo-count hidden">
                {`${activeTodos.length} items left`}
              </span>

              <TodosFilter />

              {/* don't show this button if there are no completed todos */}

              <button
                type="button"
                className={cn('todoapp__clear-completed',
                  { 'is-invisible': completedTodos.length === 0 })}
                onClick={deleteCompletedTodos}
              >
                Clear completed
              </button>
            </footer>
          </>
        )}
      </div>

      <Notification />
    </div>
  );
};
