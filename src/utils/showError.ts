import { ShowError } from '../types/ShowErrors';

export const showErrors = (error: ShowError) => {
  switch (error) {
    case ShowError.fetchTodos:
      return ShowError.fetchTodos;
    case ShowError.createTodo:
      return ShowError.createTodo;
    case ShowError.addTodo:
      return ShowError.addTodo;
    case ShowError.deleteTodo:
      return ShowError.deleteTodo;
    case ShowError.updateTodo:
      return ShowError.updateTodo;

    default:
      return error;
  }
};
