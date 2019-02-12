import { IHash, HashMapInterface } from './interfaces/hash-map.interface';

export class HashMap<T> implements HashMapInterface<T> {
    private map: IHash<T> = {};
    public size: number = 0;

    public get(key: string): T {
        return this.map[key];
    }

    public put(key: string, value: T): HashMap<T> {
        if (!this.map[key]) {
            this.size++;
        }
        this.map[key] = value;
        return this;
    }

    public contains(key: string): boolean {
        if (this.map[key]) {
            return true;
        } else {
            return false;
        }
    }

    public remove(key: string): HashMap<T> {
        if (this.map[key]) {
            this.size--;
            this.map[key] = null;
            delete this.map[key];
        }
        return this;
    }

    public removeAll(): HashMap<T> {
        this.map = {};
        this.size = 0;
        return this;
    }

    public getKeys(): string[] {
        const keys: string[] = [];
        for (const key in this.map) {
            if (this.map.hasOwnProperty(key)) {
                keys.push(key);
            }
        }
        return keys;
    }

    public getValues(): T[] {
        const values: T[] = [];
        for (const key in this.map) {
            if (this.map.hasOwnProperty(key)) {
                values.push(this.map[key]);
            }
        }
        return values;
    }

}
