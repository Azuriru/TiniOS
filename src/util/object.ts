/**
 * An updater function that takes an item and returns a function that will take
 * an object, and extend it with the item you passed.
 * It's useful when you must extend some state with an object and that object
 * does not depend on the existing state.
 *
 * Example usage:
 * ```ts
 * setSelectedItem(updater({ active: true }));
 * ```
 *
 * @param item The item to extend into the original object
 * @returns A function that will take an original object and return it extended
 */
export function updater<T, K extends number | string | symbol>(item: T): (original: Record<string, T>) => T {
    return (original: Record<K, T>) => ({ ...original, ...item });
}
