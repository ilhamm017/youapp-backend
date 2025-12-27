/**
 * Queue implementation using circular buffer for message handling
 * Demonstrates: Queue data structure, circular buffer, and FIFO principle
 */
export class MessageQueue<T> {
    private items: (T | undefined)[];
    private frontIndex: number;
    private rearIndex: number;
    private count: number;
    private capacity: number;

    constructor(capacity: number = 100) {
        this.capacity = capacity;
        this.items = new Array(capacity);
        this.frontIndex = 0;
        this.rearIndex = 0;
        this.count = 0;
    }

    /**
     * Add element to the rear of the queue
     * Time complexity: O(1)
     */
    enqueue(item: T): boolean {
        if (this.isFull()) {
            // Auto-resize if queue is full
            this.resize();
        }

        this.items[this.rearIndex] = item;
        this.rearIndex = (this.rearIndex + 1) % this.capacity;
        this.count++;
        return true;
    }

    /**
     * Remove and return element from the front of the queue
     * Time complexity: O(1)
     */
    dequeue(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }

        const item = this.items[this.frontIndex];
        this.items[this.frontIndex] = undefined;
        this.frontIndex = (this.frontIndex + 1) % this.capacity;
        this.count--;
        return item;
    }

    /**
     * View element at the front without removing it
     * Time complexity: O(1)
     */
    peek(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        return this.items[this.frontIndex];
    }

    /**
     * View element at the rear
     * Time complexity: O(1)
     */
    peekRear(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }
        const rearPos = (this.rearIndex - 1 + this.capacity) % this.capacity;
        return this.items[rearPos];
    }

    /**
     * Check if queue is empty
     * Time complexity: O(1)
     */
    isEmpty(): boolean {
        return this.count === 0;
    }

    /**
     * Check if queue is full
     * Time complexity: O(1)
     */
    isFull(): boolean {
        return this.count === this.capacity;
    }

    /**
     * Get the size of the queue
     * Time complexity: O(1)
     */
    size(): number {
        return this.count;
    }

    /**
     * Get the capacity of the queue
     * Time complexity: O(1)
     */
    getCapacity(): number {
        return this.capacity;
    }

    /**
     * Clear the queue
     * Time complexity: O(1)
     */
    clear(): void {
        this.items = new Array(this.capacity);
        this.frontIndex = 0;
        this.rearIndex = 0;
        this.count = 0;
    }

    /**
     * Resize the queue (double the capacity)
     * Time complexity: O(n)
     */
    private resize(): void {
        const newCapacity = this.capacity * 2;
        const newItems = new Array(newCapacity);

        // Copy items to new array in order
        for (let i = 0; i < this.count; i++) {
            newItems[i] = this.items[(this.frontIndex + i) % this.capacity];
        }

        this.items = newItems;
        this.frontIndex = 0;
        this.rearIndex = this.count;
        this.capacity = newCapacity;
    }

    /**
     * Convert queue to array (front to rear)
     * Time complexity: O(n)
     */
    toArray(): T[] {
        const result: T[] = [];
        for (let i = 0; i < this.count; i++) {
            const index = (this.frontIndex + i) % this.capacity;
            const item = this.items[index];
            if (item !== undefined) {
                result.push(item);
            }
        }
        return result;
    }

    /**
     * Create queue from array
     * Time complexity: O(n)
     */
    static fromArray<T>(arr: T[], capacity?: number): MessageQueue<T> {
        const queue = new MessageQueue<T>(capacity || Math.max(arr.length, 10));
        arr.forEach((item) => queue.enqueue(item));
        return queue;
    }

    /**
     * Check if queue contains an element
     * Time complexity: O(n)
     */
    contains(item: T): boolean {
        for (let i = 0; i < this.count; i++) {
            const index = (this.frontIndex + i) % this.capacity;
            if (this.items[index] === item) {
                return true;
            }
        }
        return false;
    }
}
