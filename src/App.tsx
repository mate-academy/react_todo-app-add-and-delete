/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/control-has-associated-label */
import React, { useEffect, useRef, useState } from 'react';
import { UserWarning } from './UserWarning';
import * as todosService from './api/todos';
import { OnTodoChange, Todo } from './types/Todo';
import cn from 'classnames';
import { TodoComponent } from './components/todo';
import { setFieldTodo } from './utils/setTodoField';
import { filterTodos } from './utils/filterTodos';
import { TodosFilter } from './types/TodosFilter';
import { ErrorMessage } from './components/Error';
import { ErrorMessageEnum } from './types/ErrorMessage';
import { Footer } from './components/Footer';
import { uncompletedCounter } from './utils/completedCounter';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

export const App: React.FC = () => {
  const todosFilters = ['All', 'Active', 'Completed'] as TodosFilter[];

  const [isLoading, setIsLoading] = useState(false);
  const [doubleclicked, setDoubleclicked] = useState(false);
  const [editingTodos, setEditingTodos] = useState<number[] | null>(null);

  const [todosFromServer, setTodosFromServer] = useState<Todo[]>([]);
  const [filteredTodos, setFilteredTodos] = useState<Todo[]>([]);

  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [tempTodo, setTempTodo] = useState<Omit<Todo, 'userId'> | null>(null);

  const [selectedFilter, setSelectedFilter] = useState<TodosFilter>('All');

  const [todosLeftToComplete, setTodosLeftToComplete] = useState(0);

  const [errors, setErrors] = useState({
    load: '',
    title: '',
    add: '',
    delete: '',
    update: '',
  });
  const errorsArray = Object.entries(errors);

  const [isAnyError, setIsAnyError] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const selectedFilterRef = useRef<TodosFilter>(selectedFilter);

  /* Set filter */
  useEffect(() => {
    selectedFilterRef.current = selectedFilter;
  }, [selectedFilter]);

  /* Set focus to input */
  useEffect(() => {
    if (!isLoading && (!isAnyError || errors.add.length) && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isLoading, isAnyError, errors.add.length]);

  /* Get todos */
  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const fetchedTodos = await todosService.getTodos();

        setTodosFromServer(fetchedTodos);
        fetchedTodos.forEach(
          todo => !todo.completed && setTodosLeftToComplete(prev => prev + 1),
        );
        setFilteredTodos(fetchedTodos);
      } catch (error) {
        setErrors(prev => ({ ...prev, load: ErrorMessageEnum.load }));
        setIsAnyError(true);
      }
    };

    fetchTodos();
  }, []);

  /*  For errors handling */
  useEffect(() => {
    const isSomeError = Object.values(errors).some(error => error.length);

    setIsAnyError(isSomeError);

    if (isSomeError) {
      const timeoutId = setTimeout(() => {
        setIsAnyError(false);
        setErrors({
          load: '',
          title: '',
          add: '',
          delete: '',
          update: '',
        });
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [errors]);

  /* For setting todos left to complete */
  useEffect(() => {
    setTodosLeftToComplete(uncompletedCounter(todosFromServer));
  }, [filteredTodos, todosFromServer]);

  const handleDeleteButton = async (todoId: number) => {
    setIsLoading(true);

    try {
      const response = await todosService.deleteTodo(todoId);

      if (response === 1) {
        setFilteredTodos(prev => prev.filter(todo => todo.id !== todoId));
        setTodosFromServer(prev => prev.filter(todo => todo.id !== todoId));
        setEditingTodos(null);
      } else {
        setErrors(prev => ({ ...prev, delete: ErrorMessageEnum.delete }));
        setIsAnyError(true);
      }
    } catch (error) {
      setErrors(prev => ({ ...prev, delete: ErrorMessageEnum.delete }));
      setIsAnyError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterButton = (filter: TodosFilter, updatedTodos?: Todo[]) => {
    switch (filter) {
      case 'Active':
        setFilteredTodos(
          filterTodos(updatedTodos || todosFromServer, 'completed', false),
        );
        break;
      case 'Completed':
        setFilteredTodos(
          filterTodos(updatedTodos || todosFromServer, 'completed', true),
        );
        break;
      default:
        setFilteredTodos(updatedTodos || todosFromServer);
    }
  };

  const handleTodoChange: OnTodoChange = async (todo, field, value) => {
    setIsLoading(true);

    if (field === 'title' && value === todo.title) {
      setIsLoading(false);
      setEditingTodos(null);

      return;
    }

    if (field === 'title' && typeof value === 'string' && !value.length) {
      return handleDeleteButton(todo.id);
    }

    try {
      const updatedTodo = setFieldTodo(todo, field, value);

      await todosService.updateTodo(updatedTodo);
      setTodosFromServer(prev => {
        const updatedTodos = prev.map(t =>
          t.id === updatedTodo.id ? updatedTodo : t,
        );

        handleFilterButton(selectedFilterRef.current, updatedTodos);

        return updatedTodos;
      });
      setEditingTodos(null);
      setDoubleclicked(false);
    } catch (error) {
      setErrors(prev => ({ ...prev, update: ErrorMessageEnum.update }));
      setIsAnyError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllDoneButton = async () => {
    const newFilteredTodos = filteredTodos.map(todo => {
      setEditingTodos(prev => [...(prev || []), todo.id]);

      if (todosLeftToComplete === 0) {
        handleTodoChange(todo, 'completed', false);

        return { ...todo, completed: false };
      }

      if (!todo.completed) {
        handleTodoChange(todo, 'completed', true);

        return { ...todo, completed: true };
      }

      return todo;
    });

    setFilteredTodos(newFilteredTodos);
  };

  const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) {
      e.preventDefault();
    }

    if (!newTodoTitle.trim().length) {
      setErrors(prev => ({ ...prev, title: ErrorMessageEnum.title }));
      setIsAnyError(true);
      setNewTodoTitle('');

      return;
    }

    const addTodo = async () => {
      setIsLoading(true);
      setEditingTodos([0]);
      const newTodo: Todo = {
        id: 0,
        title: newTodoTitle,
        completed: false,
        userId: todosService.USER_ID,
      };

      setTempTodo(newTodo);

      try {
        const addedTodo: Todo = await todosService.addTodo(newTodo);

        setFilteredTodos(prev => [...prev, addedTodo]);
        setTodosFromServer(prev => [...prev, addedTodo]);
        setTempTodo(null);
        setNewTodoTitle('');
        handleFilterButton(selectedFilter, [...filteredTodos, addedTodo]);
      } catch (error) {
        setErrors({ load: '', title: '', add: '', delete: '', update: '' });
        setErrors(prev => ({ ...prev, add: ErrorMessageEnum.add }));
        setIsAnyError(true);
        setTempTodo(null);
      } finally {
        setIsLoading(false);
      }
    };

    addTodo();
  };

  const handleClearCompletedButton = async () => {
    const completedTodos = filteredTodos.filter(todo => todo.completed);

    try {
      completedTodos.forEach(todo => {
        setEditingTodos(prev => [...(prev || []), todo.id]);

        return handleDeleteButton(todo.id);
      });
    } catch (error) {
      setErrors(prev => ({ ...prev, delete: ErrorMessageEnum.delete }));
      setIsAnyError(true);
    }
  };

  if (!todosService.USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <header className="todoapp__header">
          {todosFromServer.length > 0 && (
            <button
              type="button"
              className={cn('todoapp__toggle-all', {
                active: todosLeftToComplete === 0,
              })}
              data-cy="ToggleAllButton"
              onClick={handleAllDoneButton}
            />
          )}

          <form onSubmit={handleSubmit} key={todosService.USER_ID}>
            <input
              ref={inputRef}
              data-cy="NewTodoField"
              type="text"
              className="todoapp__new-todo"
              placeholder="What needs to be done?"
              autoFocus
              value={newTodoTitle}
              disabled={isLoading && newTodoTitle.length !== 0}
              onChange={e => setNewTodoTitle(e.currentTarget.value)}
            />
          </form>
        </header>
        <section className="todoapp__main" data-cy="TodoList">
          <TransitionGroup>
            {filteredTodos.map(todo => (
              <CSSTransition key={todo.id} timeout={300} classNames="item">
                <TodoComponent
                  key={todo.id}
                  todo={todo}
                  onTodoChange={handleTodoChange}
                  isLoading={isLoading}
                  isDoubleclicked={doubleclicked}
                  setIsDoubleclicked={setDoubleclicked}
                  editingTodos={editingTodos}
                  setEditingTodos={setEditingTodos}
                  onDeleteTodo={handleDeleteButton}
                />
              </CSSTransition>
            ))}
            {tempTodo !== null && (
              <CSSTransition key={tempTodo.id} timeout={300} classNames="item">
                <TodoComponent
                  key={tempTodo.id}
                  todo={tempTodo as Todo}
                  editingTodos={editingTodos}
                  isLoading={true}
                />
              </CSSTransition>
            )}
          </TransitionGroup>
        </section>

        {(todosFromServer.length > 0 || tempTodo) && (
          <Footer
            todosLeftToComplete={todosLeftToComplete}
            todosFromServer={todosFromServer}
            todosFilters={todosFilters}
            selectedFilter={selectedFilter}
            onHandleFilterButtonClick={handleFilterButton}
            onSetSelectedFilter={setSelectedFilter}
            onClearCompletedCLick={handleClearCompletedButton}
          />
        )}
      </div>

      <div
        data-cy="ErrorNotification"
        className={cn(
          'notification is-danger is-light has-text-weight-normal',
          { hidden: !isAnyError },
        )}
      >
        <button data-cy="HideErrorButton" type="button" className="delete" />
        {errorsArray.map(([key, error]) => (
          <ErrorMessage key={key} message={error} />
        ))}
      </div>
    </div>
  );
};
