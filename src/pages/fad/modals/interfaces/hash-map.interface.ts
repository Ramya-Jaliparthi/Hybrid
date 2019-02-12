export interface IHash<T> {
    [key: string]: T;
}

export interface HashMapInterface<T> {
    // map: IHash<T>;
    size: number;
    get(key: string): T;
    put(key: string, value: T): HashMapInterface<T>;
    contains(key: string): boolean;
    remove(key: string): HashMapInterface<T>;
    removeAll(): HashMapInterface<T>;
    getKeys(): string[];
    getValues(): T[];
}
