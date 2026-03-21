import { FILTERS } from '../filters/filter';
import { Todo } from '../types/Todo';

const { active, completed } = FILTERS;

export const getFilteredTodo = (todo: Todo[], filter: string) => {
  return todo.filter(t => {
    /* todo tem todos os elementos do array
        a unica coisa que filter faz é dizer: mostre os ativos, mostre todos, mostre os completos
        não posso filtrar o valor de todo e dar um setTodo pois isso vai subcrever os valores.
        */
    if (!t) {
      return false;
    }

    switch (true) {
      case filter ===
        active /* - Se o filtro atual for "active", retorna true apenas para os itens
        não concluídos (t.completed === false).
  - Resultado: só tarefas ativas entram no array.
  */:
        return t.completed === false;
      case filter === completed:
        return t.completed === true;

      default:
        return true; /* - Se não for "active" nem "completed", cai aqui.
- Isso significa que o filtro é "all".
- Retorna true para todos os itens, ou seja, mantém todos no array. */
    }
  });
};
