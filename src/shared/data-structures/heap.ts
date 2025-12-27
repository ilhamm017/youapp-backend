/**
 * Min-Heap implementation for message priority queue
 * Demonstrates: Heap data structure, priority queue, and heap operations
 */
export class PriorityMessageHeap<T> {
    private heap: T[];
    private compareFunction: (a: T, b: T) => number;

    constructor(compareFunction?: (a: T, b: T) => number) {
        this.heap = [];
        // Default compare function for min-heap (lower values have higher priority)
        this.compareFunction =
            compareFunction ||
            ((a: any, b: any) => {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            });
    }

    /**
     * Insert an element into the heap
     * Time complexity: O(log n)
     */
    insert(value: T): void {
        this.heap.push(value);
        this.heapifyUp(this.heap.length - 1);
    }

    /**
     * Extract the minimum element (root) from the heap
     * Time complexity: O(log n)
     */
    extractMin(): T | undefined {
        if (this.isEmpty()) {
            return undefined;
        }

        if (this.heap.length === 1) {
            return this.heap.pop();
        }

        const min = this.heap[0];
        this.heap[0] = this.heap.pop()!;
        this.heapifyDown(0);

        return min;
    }

    /**
     * View the minimum element without removing it
     * Time complexity: O(1)
     */
    peek(): T | undefined {
        return this.heap[0];
    }

    /**
     * Heapify up operation (bubble up)
     * Time complexity: O(log n)
     */
    private heapifyUp(index: number): void {
        while (index > 0) {
            const parentIndex = Math.floor((index - 1) / 2);

            if (this.compareFunction(this.heap[index], this.heap[parentIndex]) < 0) {
                this.swap(index, parentIndex);
                index = parentIndex;
            } else {
                break;
            }
        }
    }

    /**
     * Heapify down operation (bubble down)
     * Time complexity: O(log n)
     */
    private heapifyDown(index: number): void {
        while (true) {
            const leftChildIndex = 2 * index + 1;
            const rightChildIndex = 2 * index + 2;
            let smallest = index;

            if (
                leftChildIndex < this.heap.length &&
                this.compareFunction(this.heap[leftChildIndex], this.heap[smallest]) < 0
            ) {
                smallest = leftChildIndex;
            }

            if (
                rightChildIndex < this.heap.length &&
                this.compareFunction(this.heap[rightChildIndex], this.heap[smallest]) <
                0
            ) {
                smallest = rightChildIndex;
            }

            if (smallest !== index) {
                this.swap(index, smallest);
                index = smallest;
            } else {
                break;
            }
        }
    }

    /**
     * Swap two elements in the heap
     * Time complexity: O(1)
     */
    private swap(i: number, j: number): void {
        [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
    }

    /**
     * Build heap from an array
     * Time complexity: O(n)
     */
    static fromArray<T>(
        arr: T[],
        compareFunction?: (a: T, b: T) => number,
    ): PriorityMessageHeap<T> {
        const heap = new PriorityMessageHeap<T>(compareFunction);
        heap.heap = [...arr];

        // Start from last non-leaf node and heapify down
        for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
            heap.heapifyDown(i);
        }

        return heap;
    }

    /**
     * Remove a specific element from the heap
     * Time complexity: O(n)
     */
    remove(value: T): boolean {
        const index = this.heap.findIndex(
            (item) => this.compareFunction(item, value) === 0,
        );

        if (index === -1) {
            return false;
        }

        if (index === this.heap.length - 1) {
            this.heap.pop();
            return true;
        }

        this.heap[index] = this.heap.pop()!;

        // Determine whether to heapify up or down
        const parentIndex = Math.floor((index - 1) / 2);
        if (
            index > 0 &&
            this.compareFunction(this.heap[index], this.heap[parentIndex]) < 0
        ) {
            this.heapifyUp(index);
        } else {
            this.heapifyDown(index);
        }

        return true;
    }

    /**
     * Get the size of the heap
     * Time complexity: O(1)
     */
    size(): number {
        return this.heap.length;
    }

    /**
     * Check if heap is empty
     * Time complexity: O(1)
     */
    isEmpty(): boolean {
        return this.heap.length === 0;
    }

    /**
     * Clear the heap
     * Time complexity: O(1)
     */
    clear(): void {
        this.heap = [];
    }

    /**
     * Convert heap to array (not sorted)
     * Time complexity: O(1)
     */
    toArray(): T[] {
        return [...this.heap];
    }

    /**
     * Get sorted array (heap sort)
     * Time complexity: O(n log n)
     */
    toSortedArray(): T[] {
        const sorted: T[] = [];
        const tempHeap = new PriorityMessageHeap<T>(this.compareFunction);
        tempHeap.heap = [...this.heap];

        while (!tempHeap.isEmpty()) {
            sorted.push(tempHeap.extractMin()!);
        }

        return sorted;
    }

    /**
     * Check if heap contains an element
     * Time complexity: O(n)
     */
    contains(value: T): boolean {
        return this.heap.some((item) => this.compareFunction(item, value) === 0);
    }

    /**
     * Update the priority of an element
     * Time complexity: O(n)
     */
    update(oldValue: T, newValue: T): boolean {
        const index = this.heap.findIndex(
            (item) => this.compareFunction(item, oldValue) === 0,
        );

        if (index === -1) {
            return false;
        }

        this.heap[index] = newValue;

        // Determine whether to heapify up or down
        const parentIndex = Math.floor((index - 1) / 2);
        if (
            index > 0 &&
            this.compareFunction(this.heap[index], this.heap[parentIndex]) < 0
        ) {
            this.heapifyUp(index);
        } else {
            this.heapifyDown(index);
        }

        return true;
    }
}
