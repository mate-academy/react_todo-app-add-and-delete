export class CollBeakFilter {
  public static Filter<T>(
    items: T[],
    predicates: ((item: T) => boolean)[],
  ): T[] {
    return items.filter(item => {
      for (const predicat of predicates) {
        if (!predicat(item)) {
          return false;
        }
      }

      return true;
    });
  }
}
