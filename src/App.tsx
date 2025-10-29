import { FC, FormEvent, useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { Todo } from './types/Todo';
import { Completed } from './types/Completed';

import { addTodo, deleteTodo, getTodos, USER_ID } from './api/todos';
import { filterTodos } from './utils/filterTodos';
import { focusInput } from './utils/focusInput';
import { showError } from './utils/showError';
import { UserWarning } from './UserWarning';

import { TodoItem } from './components/TodoItem';
import { TodoFooter } from './components/TodoFooter';
import { ErrorNotification } from './components/ErrorNotification';
import { TodoForm } from './components/TodoForm';

export const App: FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<Completed>(
    Completed.all,
  );
  const [isAdding, setIsAdding] = useState(false);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);
  const [title, setTitle] = useState('');
  const [deletingTodoId, setDeletingTodoId] = useState<number | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);

  const filteredTodos = filterTodos(todos, selectedFilter);

  useEffect(() => {
    getTodos()
      .then(fetchedTodos => {
        setTodos(fetchedTodos);
        focusInput(inputRef);
      })
      .catch(() => {
        showError(setErrorMessage, 'Unable to load todos');
      });
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  const handleAddTodo = (event: FormEvent) => {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      showError(setErrorMessage, 'Title should not be empty');

      return;
    }

    const todoToAdded = {
      userId: USER_ID,
      completed: false,
      title: trimmedTitle,
    };

    setTempTodo({ ...todoToAdded, id: 0 });

    setIsAdding(true);

    addTodo(todoToAdded)
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
        setTitle('');
      })
      .catch(() => {
        showError(setErrorMessage, 'Unable to add a todo');
      })
      .finally(() => {
        setTempTodo(null);
        setIsAdding(false);
        focusInput(inputRef);
      });
  };

  const handleDeleteTodo = (todoId: number) => {
    setDeletingTodoId(todoId);

    deleteTodo(todoId)
      .then(() => {
        setTodos(currentTodos =>
          currentTodos.filter(todo => todo.id !== todoId),
        );
      })
      .catch(() => {
        showError(setErrorMessage, 'Unable to delete a todo');
      })
      .finally(() => {
        setDeletingTodoId(null);
        focusInput(inputRef);
      });
  };

  const handleClearCompleted = () => {
    const completedTodos = todos.filter(todo => todo.completed);
    const idsToDelete = completedTodos.map(todo => todo.id);

    Promise.allSettled(idsToDelete.map(id => deleteTodo(id)))
      .then(results => {
        const successfulIds = idsToDelete.filter(
          (_, index) => results[index].status === 'fulfilled',
        );

        setTodos(current =>
          current.filter(todo => !successfulIds.includes(todo.id)),
        );

        const hasFailures = results.some(
          result => result.status === 'rejected',
        );

        if (hasFailures) {
          showError(setErrorMessage, 'Unable to delete a todo');
        }
      })
      .finally(() => {
        focusInput(inputRef);
      });
  };

  const changeSelectedFilter = (filterName: Completed) => {
    setSelectedFilter(filterName);
  };

  const onCloseError = () => {
    setErrorMessage('');
  };

  const changeTitle = (newTitle: string) => {
    setTitle(newTitle);
  };

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          <button
            type="button"
            className={classNames('todoapp__toggle-all', {
              active: todos.every(todo => todo.completed),
            })}
            data-cy="ToggleAllButton"
          />

          <TodoForm
            onAdd={handleAddTodo}
            inputRef={inputRef}
            title={title}
            isAdding={isAdding}
            changeTitle={changeTitle}
          />
        </header>

        {(todos.length > 0 || tempTodo) && (
          <section className="todoapp__main" data-cy="TodoList">
            <TransitionGroup component={null}>
              {filteredTodos.map(todo => (
                <CSSTransition key={todo.id} timeout={300} classNames="item">
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onDelete={handleDeleteTodo}
                    isDeleting={deletingTodoId}
                  />
                </CSSTransition>
              ))}

              {tempTodo && (
                <CSSTransition key={0} timeout={300} classNames="temp-item">
                  <TodoItem
                    todo={tempTodo}
                    onDelete={() => {}}
                    isLoading={isAdding}
                  />
                </CSSTransition>
              )}
            </TransitionGroup>
          </section>
        )}

        {todos.length !== 0 && (
          <TodoFooter
            todos={todos}
            selectedFilter={selectedFilter}
            onDeleteCompleted={handleClearCompleted}
            changeSelectedFilter={changeSelectedFilter}
          />
        )}
      </div>

      <ErrorNotification
        errorMessage={errorMessage}
        onCloseError={onCloseError}
      />
    </div>
  );
};
