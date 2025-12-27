/**
 * TreeNode class for Binary Search Tree
 */
export class TreeNode<T> {
    data: T;
    left: TreeNode<T> | null;
    right: TreeNode<T> | null;

    constructor(data: T) {
        this.data = data;
        this.left = null;
        this.right = null;
    }
}

/**
 * Binary Search Tree implementation for message threading
 * Demonstrates: BST operations, tree traversals, and recursive algorithms
 */
export class MessageTree<T> {
    root: TreeNode<T> | null;
    private compareFunction: (a: T, b: T) => number;

    constructor(compareFunction?: (a: T, b: T) => number) {
        this.root = null;
        // Default compare function for numbers/strings
        this.compareFunction =
            compareFunction ||
            ((a: any, b: any) => {
                if (a < b) return -1;
                if (a > b) return 1;
                return 0;
            });
    }

    /**
     * Insert a value into the BST
     * Time complexity: O(log n) average, O(n) worst case
     */
    insert(data: T): void {
        const newNode = new TreeNode(data);

        if (!this.root) {
            this.root = newNode;
            return;
        }

        this.insertNode(this.root, newNode);
    }

    private insertNode(node: TreeNode<T>, newNode: TreeNode<T>): void {
        if (this.compareFunction(newNode.data, node.data) < 0) {
            if (!node.left) {
                node.left = newNode;
            } else {
                this.insertNode(node.left, newNode);
            }
        } else {
            if (!node.right) {
                node.right = newNode;
            } else {
                this.insertNode(node.right, newNode);
            }
        }
    }

    /**
     * Search for a value in the BST
     * Time complexity: O(log n) average, O(n) worst case
     */
    search(data: T): TreeNode<T> | null {
        return this.searchNode(this.root, data);
    }

    private searchNode(node: TreeNode<T> | null, data: T): TreeNode<T> | null {
        if (!node) {
            return null;
        }

        const comparison = this.compareFunction(data, node.data);

        if (comparison === 0) {
            return node;
        } else if (comparison < 0) {
            return this.searchNode(node.left, data);
        } else {
            return this.searchNode(node.right, data);
        }
    }

    /**
     * In-order traversal (Left -> Root -> Right)
     * Returns sorted array
     * Time complexity: O(n)
     */
    inOrderTraversal(): T[] {
        const result: T[] = [];
        this.inOrder(this.root, result);
        return result;
    }

    private inOrder(node: TreeNode<T> | null, result: T[]): void {
        if (node) {
            this.inOrder(node.left, result);
            result.push(node.data);
            this.inOrder(node.right, result);
        }
    }

    /**
     * Pre-order traversal (Root -> Left -> Right)
     * Time complexity: O(n)
     */
    preOrderTraversal(): T[] {
        const result: T[] = [];
        this.preOrder(this.root, result);
        return result;
    }

    private preOrder(node: TreeNode<T> | null, result: T[]): void {
        if (node) {
            result.push(node.data);
            this.preOrder(node.left, result);
            this.preOrder(node.right, result);
        }
    }

    /**
     * Post-order traversal (Left -> Right -> Root)
     * Time complexity: O(n)
     */
    postOrderTraversal(): T[] {
        const result: T[] = [];
        this.postOrder(this.root, result);
        return result;
    }

    private postOrder(node: TreeNode<T> | null, result: T[]): void {
        if (node) {
            this.postOrder(node.left, result);
            this.postOrder(node.right, result);
            result.push(node.data);
        }
    }

    /**
     * Level-order traversal (BFS)
     * Time complexity: O(n)
     */
    levelOrderTraversal(): T[] {
        if (!this.root) {
            return [];
        }

        const result: T[] = [];
        const queue: TreeNode<T>[] = [this.root];

        while (queue.length > 0) {
            const node = queue.shift()!;
            result.push(node.data);

            if (node.left) {
                queue.push(node.left);
            }
            if (node.right) {
                queue.push(node.right);
            }
        }

        return result;
    }

    /**
     * Find minimum value in the tree
     * Time complexity: O(log n) average, O(n) worst case
     */
    findMin(): T | null {
        if (!this.root) {
            return null;
        }

        let current = this.root;
        while (current.left) {
            current = current.left;
        }
        return current.data;
    }

    /**
     * Find maximum value in the tree
     * Time complexity: O(log n) average, O(n) worst case
     */
    findMax(): T | null {
        if (!this.root) {
            return null;
        }

        let current = this.root;
        while (current.right) {
            current = current.right;
        }
        return current.data;
    }

    /**
     * Remove a value from the BST
     * Time complexity: O(log n) average, O(n) worst case
     */
    remove(data: T): boolean {
        const result = this.removeNode(this.root, data);
        if (result.removed) {
            this.root = result.node;
            return true;
        }
        return false;
    }

    private removeNode(
        node: TreeNode<T> | null,
        data: T,
    ): { node: TreeNode<T> | null; removed: boolean } {
        if (!node) {
            return { node: null, removed: false };
        }

        const comparison = this.compareFunction(data, node.data);

        if (comparison < 0) {
            const result = this.removeNode(node.left, data);
            node.left = result.node;
            return { node, removed: result.removed };
        } else if (comparison > 0) {
            const result = this.removeNode(node.right, data);
            node.right = result.node;
            return { node, removed: result.removed };
        } else {
            // Node to be deleted found

            // Case 1: No children
            if (!node.left && !node.right) {
                return { node: null, removed: true };
            }

            // Case 2: One child
            if (!node.left) {
                return { node: node.right, removed: true };
            }
            if (!node.right) {
                return { node: node.left, removed: true };
            }

            // Case 3: Two children
            // Find minimum value in right subtree
            let minRight = node.right;
            while (minRight.left) {
                minRight = minRight.left;
            }

            // Replace node's data with min value from right subtree
            node.data = minRight.data;

            // Remove the min node from right subtree
            const result = this.removeNode(node.right, minRight.data);
            node.right = result.node;

            return { node, removed: true };
        }
    }

    /**
     * Get the height of the tree
     * Time complexity: O(n)
     */
    height(): number {
        return this.getHeight(this.root);
    }

    private getHeight(node: TreeNode<T> | null): number {
        if (!node) {
            return -1;
        }
        return 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    }

    /**
     * Count total nodes in the tree
     * Time complexity: O(n)
     */
    size(): number {
        return this.countNodes(this.root);
    }

    private countNodes(node: TreeNode<T> | null): number {
        if (!node) {
            return 0;
        }
        return 1 + this.countNodes(node.left) + this.countNodes(node.right);
    }

    /**
     * Check if tree is empty
     * Time complexity: O(1)
     */
    isEmpty(): boolean {
        return this.root === null;
    }

    /**
     * Clear the tree
     * Time complexity: O(1)
     */
    clear(): void {
        this.root = null;
    }
}
