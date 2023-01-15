import { useContext, useEffect, useState } from 'react';
import { deleteTodo } from '../../../api/todos';
import { ErrorContextType } from '../../../types/ErrorContextType';
import { Todo } from '../../../types/Todo';
import { TodoContextType } from '../../../types/TodoContextType';
import { ErrorContext } from '../../Error/ErrorContext';
import { TodoContext } from '../TodoContext';
import FooterLink from './FooterLink/FooterLink';

enum FilterTypes {
  All = 'all',
  Completed = 'completed',
  Active = 'active',
}

const TodoFooter = () => {
  const { todos, visibleTodos, setVisibleTodos }
  = useContext(TodoContext) as TodoContextType;
  const { setIsError, setErrorText }
  = useContext(ErrorContext) as ErrorContextType;
  const [selectedClass, setSelectedClass] = useState('all');

  const filterTodos = () => {
    setVisibleTodos(todos.filter((todo: Todo) => {
      return todo;
    }));
  };

  const completedTodos = visibleTodos.filter((todo: Todo) => todo.completed);
  const activeTodos = visibleTodos.filter((todo: Todo) => !todo.completed);

  useEffect(() => {
    filterTodos();
  }, []);

  const showAllTodos = () => {
    filterTodos();
    setSelectedClass(FilterTypes.All);
  };

  const showFilteredTodos = (value: string) => {
    setVisibleTodos(todos.filter((todo: Todo) => {
      return (
        value === 'active'
          ? !todo.completed
          : todo.completed
      );
    }));
    setSelectedClass(value);
  };

  const clearCompletedTodos = async () => {
    try {
      completedTodos.filter(async (todo:Todo) => {
        await deleteTodo(todo.id);

        return todo;
      });
      setVisibleTodos(activeTodos);
    } catch (err) {
      setIsError(true);
      setErrorText('Unable to delete todos');
    }
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="todosCounter">
        {`${activeTodos.length} items left`}
      </span>

      <nav className="filter" data-cy="Filter">
        <FooterLink
          href="#/"
          dataCy="FilterLinkAll"
          className={`filter__link ${selectedClass === 'all' && 'selected'}`}
          text="All"
          onClick={showAllTodos}
        />
        <FooterLink
          href="#/active"
          dataCy="FilterLinkActive"
          className={`filter__link ${selectedClass === 'active' && 'selected'}`}
          text="Active"
          onClick={() => showFilteredTodos(FilterTypes.Active)}
        />
        <FooterLink
          dataCy="FilterLinkCompleted"
          href="#/completed"
          className={`filter__link ${selectedClass === 'completed' && 'selected'}`}
          text="Completed"
          onClick={() => showFilteredTodos(FilterTypes.Completed)}
        />

      </nav>

      {!!completedTodos.length && (
        <button
          data-cy="ClearCompletedButton"
          type="button"
          className="todoapp__clear-completed"
          onClick={clearCompletedTodos}
        >
          Clear completed
        </button>
      )}
    </footer>
  );
};

export default TodoFooter;
