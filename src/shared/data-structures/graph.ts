/**
 * Graph implementation using adjacency list for user relationships
 * Demonstrates: Graph data structure, BFS, DFS, and shortest path algorithms
 */
export class UserGraph<T> {
    private adjacencyList: Map<T, Set<T>>;
    private directed: boolean;

    constructor(directed: boolean = false) {
        this.adjacencyList = new Map();
        this.directed = directed;
    }

    /**
     * Add a vertex to the graph
     * Time complexity: O(1)
     */
    addVertex(vertex: T): void {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, new Set());
        }
    }

    /**
     * Add an edge between two vertices
     * Time complexity: O(1)
     */
    addEdge(vertex1: T, vertex2: T): void {
        this.addVertex(vertex1);
        this.addVertex(vertex2);

        this.adjacencyList.get(vertex1)!.add(vertex2);

        if (!this.directed) {
            this.adjacencyList.get(vertex2)!.add(vertex1);
        }
    }

    /**
     * Remove an edge between two vertices
     * Time complexity: O(1)
     */
    removeEdge(vertex1: T, vertex2: T): void {
        if (this.adjacencyList.has(vertex1)) {
            this.adjacencyList.get(vertex1)!.delete(vertex2);
        }

        if (!this.directed && this.adjacencyList.has(vertex2)) {
            this.adjacencyList.get(vertex2)!.delete(vertex1);
        }
    }

    /**
     * Remove a vertex and all its edges
     * Time complexity: O(V + E)
     */
    removeVertex(vertex: T): void {
        if (!this.adjacencyList.has(vertex)) {
            return;
        }

        // Remove all edges to this vertex
        for (const adjacentVertex of this.adjacencyList.keys()) {
            this.adjacencyList.get(adjacentVertex)!.delete(vertex);
        }

        // Remove the vertex itself
        this.adjacencyList.delete(vertex);
    }

    /**
     * Get all neighbors of a vertex
     * Time complexity: O(1)
     */
    getNeighbors(vertex: T): T[] {
        return this.adjacencyList.has(vertex)
            ? Array.from(this.adjacencyList.get(vertex)!)
            : [];
    }

    /**
     * Check if two vertices are connected
     * Time complexity: O(1)
     */
    hasEdge(vertex1: T, vertex2: T): boolean {
        return this.adjacencyList.has(vertex1)
            ? this.adjacencyList.get(vertex1)!.has(vertex2)
            : false;
    }

    /**
     * Breadth-First Search
     * Time complexity: O(V + E)
     */
    bfs(startVertex: T): T[] {
        if (!this.adjacencyList.has(startVertex)) {
            return [];
        }

        const visited = new Set<T>();
        const queue: T[] = [startVertex];
        const result: T[] = [];

        visited.add(startVertex);

        while (queue.length > 0) {
            const vertex = queue.shift()!;
            result.push(vertex);

            for (const neighbor of this.adjacencyList.get(vertex)!) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    queue.push(neighbor);
                }
            }
        }

        return result;
    }

    /**
     * Depth-First Search (iterative)
     * Time complexity: O(V + E)
     */
    dfs(startVertex: T): T[] {
        if (!this.adjacencyList.has(startVertex)) {
            return [];
        }

        const visited = new Set<T>();
        const stack: T[] = [startVertex];
        const result: T[] = [];

        while (stack.length > 0) {
            const vertex = stack.pop()!;

            if (!visited.has(vertex)) {
                visited.add(vertex);
                result.push(vertex);

                // Add neighbors to stack in reverse to maintain natural order
                const neighbors = Array.from(this.adjacencyList.get(vertex)!);
                for (let i = neighbors.length - 1; i >= 0; i--) {
                    if (!visited.has(neighbors[i])) {
                        stack.push(neighbors[i]);
                    }
                }
            }
        }

        return result;
    }

    /**
     * Depth-First Search (recursive)
     * Time complexity: O(V + E)
     */
    dfsRecursive(startVertex: T): T[] {
        const visited = new Set<T>();
        const result: T[] = [];

        this.dfsHelper(startVertex, visited, result);

        return result;
    }

    private dfsHelper(vertex: T, visited: Set<T>, result: T[]): void {
        if (!this.adjacencyList.has(vertex) || visited.has(vertex)) {
            return;
        }

        visited.add(vertex);
        result.push(vertex);

        for (const neighbor of this.adjacencyList.get(vertex)!) {
            this.dfsHelper(neighbor, visited, result);
        }
    }

    /**
     * Find shortest path between two vertices using BFS
     * Time complexity: O(V + E)
     */
    shortestPath(startVertex: T, endVertex: T): T[] | null {
        if (
            !this.adjacencyList.has(startVertex) ||
            !this.adjacencyList.has(endVertex)
        ) {
            return null;
        }

        const visited = new Set<T>();
        const queue: T[] = [startVertex];
        const parent = new Map<T, T | null>();

        visited.add(startVertex);
        parent.set(startVertex, null);

        while (queue.length > 0) {
            const vertex = queue.shift()!;

            if (vertex === endVertex) {
                // Reconstruct path
                const path: T[] = [];
                let current: T | null = endVertex;

                while (current !== null) {
                    path.unshift(current);
                    current = parent.get(current)!;
                }

                return path;
            }

            for (const neighbor of this.adjacencyList.get(vertex)!) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    parent.set(neighbor, vertex);
                    queue.push(neighbor);
                }
            }
        }

        return null; // No path found
    }

    /**
     * Check if the graph has a cycle (for undirected graphs)
     * Time complexity: O(V + E)
     */
    hasCycle(): boolean {
        const visited = new Set<T>();

        for (const vertex of this.adjacencyList.keys()) {
            if (!visited.has(vertex)) {
                if (this.hasCycleHelper(vertex, visited, null)) {
                    return true;
                }
            }
        }

        return false;
    }

    private hasCycleHelper(
        vertex: T,
        visited: Set<T>,
        parent: T | null,
    ): boolean {
        visited.add(vertex);

        for (const neighbor of this.adjacencyList.get(vertex)!) {
            if (!visited.has(neighbor)) {
                if (this.hasCycleHelper(neighbor, visited, vertex)) {
                    return true;
                }
            } else if (neighbor !== parent) {
                // Found a back edge
                return true;
            }
        }

        return false;
    }

    /**
     * Get all vertices in the graph
     * Time complexity: O(V)
     */
    getVertices(): T[] {
        return Array.from(this.adjacencyList.keys());
    }

    /**
     * Get the number of vertices
     * Time complexity: O(1)
     */
    vertexCount(): number {
        return this.adjacencyList.size;
    }

    /**
     * Get the number of edges
     * Time complexity: O(V)
     */
    edgeCount(): number {
        let count = 0;
        for (const edges of this.adjacencyList.values()) {
            count += edges.size;
        }
        return this.directed ? count : count / 2;
    }

    /**
     * Check if graph is empty
     * Time complexity: O(1)
     */
    isEmpty(): boolean {
        return this.adjacencyList.size === 0;
    }

    /**
     * Clear the graph
     * Time complexity: O(1)
     */
    clear(): void {
        this.adjacencyList.clear();
    }

    /**
     * Get degree of a vertex
     * Time complexity: O(1)
     */
    getDegree(vertex: T): number {
        return this.adjacencyList.has(vertex)
            ? this.adjacencyList.get(vertex)!.size
            : 0;
    }

    /**
     * Print the graph
     */
    print(): void {
        for (const [vertex, neighbors] of this.adjacencyList.entries()) {
            console.log(
                `${vertex} -> ${Array.from(neighbors).join(', ') || 'no neighbors'}`,
            );
        }
    }
}
