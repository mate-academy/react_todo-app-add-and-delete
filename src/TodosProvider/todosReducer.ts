import { ActionType } from '../types/ActionType';
import { Todo } from '../types/Todo';
import { Action } from './types/Action';

export const reducer = (todos: Todo[], action: Action): Todo[] => {
  switch (action.type) {
    case ActionType.GetTodos:
      return action.payload;
    case ActionType.AddTodo:
      return [...todos, action.payload];
    case ActionType.DeleteTodo:
      return todos.filter(({ id }) => id !== action.payload);
    case ActionType.ChangeStatus:
      return todos.map(todo =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo,
      );
    case ActionType.ChangeName:
      const { id, title } = action.payload;
      const normalizedTitle = title.trim();

      if (normalizedTitle === '') {
        return todos.filter(todo => todo.id !== id);
      }

      return todos.map(todo =>
        todo.id === id ? { ...todo, title: normalizedTitle } : todo,
      );
    case ActionType.LeadToOneStatus:
      return todos.map(todo => ({ ...todo, completed: action.payload }));
    case ActionType.ClearCompleted:
      return todos.filter(({ completed }) => !completed);
    default:
      return todos;
  }
};
