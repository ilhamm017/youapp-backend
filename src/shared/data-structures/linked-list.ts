/**
 * Node class for LinkedList
 */
export class LinkedListNode<T> {
    data: T;
    next: LinkedListNode<T> | null;

    constructor(data: T) {
        this.data = data;
        this.next = null;
    }
}

/**
 * LinkedList implementation for managing user interests
 * Demonstrates: OOP principles, generic types, and linked list operations
 */
export class InterestLinkedList<T = string> {
    private head: LinkedListNode<T> | null;
    private tail: LinkedListNode<T> | null;
    private length: number;

    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    /**
     * Insert element at the end of the list
     * Time complexity: O(1)
     */
    insert(data: T): void {
        const newNode = new LinkedListNode(data);

        if (!this.head) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail!.next = newNode;
            this.tail = newNode;
        }

        this.length++;
    }

    /**
     * Insert element at specific position
     * Time complexity: O(n)
     */
    insertAt(data: T, position: number): boolean {
        if (position < 0 || position > this.length) {
            return false;
        }

        const newNode = new LinkedListNode(data);

        if (position === 0) {
            newNode.next = this.head;
            this.head = newNode;
            if (!this.tail) {
                this.tail = newNode;
            }
        } else if (position === this.length) {
            this.insert(data);
            return true;
        } else {
            let current = this.head;
            for (let i = 0; i < position - 1; i++) {
                current = current!.next;
            }
            newNode.next = current!.next;
            current!.next = newNode;
        }

        this.length++;
        return true;
    }

    /**
     * Remove element by value
     * Time complexity: O(n)
     */
    remove(data: T): boolean {
        if (!this.head) {
            return false;
        }

        if (this.head.data === data) {
            this.head = this.head.next;
            if (!this.head) {
                this.tail = null;
            }
            this.length--;
            return true;
        }

        let current = this.head;
        while (current.next) {
            if (current.next.data === data) {
                current.next = current.next.next;
                if (!current.next) {
                    this.tail = current;
                }
                this.length--;
                return true;
            }
            current = current.next;
        }

        return false;
    }

    /**
     * Remove element at specific position
     * Time complexity: O(n)
     */
    removeAt(position: number): T | null {
        if (position < 0 || position >= this.length || !this.head) {
            return null;
        }

        let removedData: T;

        if (position === 0) {
            removedData = this.head.data;
            this.head = this.head.next;
            if (!this.head) {
                this.tail = null;
            }
        } else {
            let current = this.head;
            for (let i = 0; i < position - 1; i++) {
                current = current!.next!;
            }
            removedData = current.next!.data;
            current.next = current.next!.next;
            if (!current.next) {
                this.tail = current;
            }
        }

        this.length--;
        return removedData;
    }

    /**
     * Find element in the list
     * Time complexity: O(n)
     */
    find(data: T): LinkedListNode<T> | null {
        let current = this.head;
        while (current) {
            if (current.data === data) {
                return current;
            }
            current = current.next;
        }
        return null;
    }

    /**
     * Get element at specific position
     * Time complexity: O(n)
     */
    getAt(position: number): T | null {
        if (position < 0 || position >= this.length || !this.head) {
            return null;
        }

        let current = this.head;
        for (let i = 0; i < position; i++) {
            current = current!.next!;
        }

        return current.data;
    }

    /**
     * Convert linked list to array
     * Time complexity: O(n)
     */
    toArray(): T[] {
        const result: T[] = [];
        let current = this.head;
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }

    /**
     * Create linked list from array
     * Time complexity: O(n)
     */
    static fromArray<T>(arr: T[]): InterestLinkedList<T> {
        const list = new InterestLinkedList<T>();
        arr.forEach((item) => list.insert(item));
        return list;
    }

    /**
     * Clear the list
     * Time complexity: O(1)
     */
    clear(): void {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    /**
     * Get the size of the list
     * Time complexity: O(1)
     */
    size(): number {
        return this.length;
    }

    /**
     * Check if list is empty
     * Time complexity: O(1)
     */
    isEmpty(): boolean {
        return this.length === 0;
    }

    /**
     * Reverse the linked list
     * Time complexity: O(n)
     */
    reverse(): void {
        if (!this.head || !this.head.next) {
            return;
        }

        let prev: LinkedListNode<T> | null = null;
        let current: LinkedListNode<T> | null = this.head;
        this.tail = this.head;

        while (current) {
            const next = current.next;
            current.next = prev;
            prev = current;
            current = next;
        }

        this.head = prev;
    }
}
