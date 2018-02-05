/**
 * Class of the silmaril's node
 */
class SilNode<T> {

    /**
     * Any value that node can store
     */
    _value: T

    /**
     * Depth of the node that defines
     * the level of silmaril where it exists
     */
    _depth: number   

     /**
     * Index of the node that defines 
     * the posiotion on the concrete level of silmaril
     */
    _index: number 

    /**
     * List of children nodes
     */
    _children: SilNode<T>[]

    /**
     * Pointer to the previous node's neighbour of the level
     */
    _prev: SilNode<T>

    /**
     * Pointer to the next node's neighbour of the level
     */
    _next: SilNode<T>

    constructor(value: T, depth?: number, index?: number) {
        this._value = value
        this._depth = depth
        this._index = index
        this._children = []
    }
}

// TODO implement in future versions to replace arrays
class LinkedArrayList<T> {
    _size: number    
    _head: SilNode<T>
    _tail: SilNode<T>
    _nodes: SilNode<T>[]
}

/**
 * Class of custom data structure that is based on the combination of tree and arrays.
 * As a tree it has only one root, each node can have N childen.
 * As an array-based structure, each level of the tree is represented as an array 
 * (in future releasesit will be represented as linked arraylist) of all children nodes 
 * from all parents above.
 * The idea was to speed up an access to any node of silmaril by depth and index and 
 * to make unique each node of this structure.
 */
export default class Silmaril<T> {
    
    /**
     * Root-node of the silmaril 
     */
    private _root: SilNode<T>

    /**
     * All levels of the silmaril are represented as map.
     * Keys store levels' numbers, values store arrays of nodes
     */
    private _levels: Map<number, SilNode<T>[]>

    constructor() {        
        this._levels = new Map<number, SilNode<T>[]>()
    }

    get root(): SilNode<T> {
        return this._root
    }

    get levels(): Map<number, SilNode<T>[]> {
        return this._levels
    }

    /**
     * Function that returns the entire level of silmaril nodes
     * @param depth of the node
     */
    public getLevelNodes(depth: number) {
        return this._levels.get(depth)
    }

    /**
     * Function that returns the concrete silmaril node
     * @param depth of the node
     * @param index of the node
     */
    public getNode(depth: number, index: number): SilNode<T> {        
        return this.getLevelNodes(depth).find((node: SilNode<T>) => node._index === index)
    }

    /**
     * Function that adds the new node to the conrete silmaril parent-node.
     * If parent-node is not defined by depth and index,uit adds the node
     * to the root-node
     * @param value of new node
     * @param depth of the parent node
     * @param index of the parent node
     */
    public addNode(value: T, depth?: number, index?: number): void {   
       if(depth >= 0 && index >= 0) {
            const destNode = this.getNode(depth, index)         
            this.addNewNode(value, destNode)
       } else {
            this.addNewNode(value)      
       }      
    }

    /**
     * Function that adds set of silmaril nodes to the conrete parent node.
     * If parent-node is not defined by depth and index, elements
     * will be added as children to the root-node. If the root is not defined,
     * the first node of set will be registered as root, the rest nodes will be
     * added as children to it.
     * @param values 
     * @param depth 
     * @param index 
     */
    public addNodes(values: T[], depth?: number, index?: number): void {
        values.forEach(value => this.addNode(value, depth, index))
    }

    /**
     * Function that removes the concrete node with all its children from silmaril
     * @param depth 
     * @param index 
     */
    public removeNode(depth: number, index: number): void {
        const nodeToRemove = this.getNode(depth, index)      
        if(nodeToRemove) {
            if(this._root === nodeToRemove) {
                this._root = null
                this._levels = new Map<number, SilNode<T>[]>()
            } else {
                const parentNode = this.getLevelNodes(depth - 1).find(parent => parent._children.includes(nodeToRemove)) 
                if(parentNode && parentNode._children && parentNode._children[index]) {
                    parentNode._children.splice(index, 1)                    
                }              
                const source = [...this.getLevelNodes(depth)]    
                source.splice(index, 1)
                this._levels.set(depth, source)               
                this.updateIndexes(depth)
                if(nodeToRemove._children) {
                    nodeToRemove._children.forEach((child) => {
                        this.removeNode(child._depth, child._index)
                    })
                }             
            }           
        }     
    }    

    /**
     * Function that removes all silmaril nodes from the concrete depth from one position to another
     * @param depth 
     * @param startIndex position, from which deletion starts (includes while removing)
     * @param endIndex position, until which the deletion will continue (not includes while removing)
     */
    public removeNodes(depth: number, startIndex: number, endIndex: number): void {
        const level = this.getLevelNodes(depth)
        if(level) {
            for(let index = startIndex; index < endIndex; index++) {               
                this.removeNode(depth, 0)            
            }       
        }      
    }

    /**
     * Function that removes all silmaril nodes from the concrete depth
     * @param depth 
     */
    public clearLevel(depth: number): void {
        const level = this.getLevelNodes(depth)
        if(level) {
            for(let index = 0; index < level.length; index++) {               
                this.removeNode(depth, 0)                     
            }     
        }
    }

    /**
     * TODO NEED TO UPGRADE THIS
     * @param depth 
     * @param index 
     * @param values 
     */
    public replaceNode(depth: number, index: number, values: T[]): void {       
       this.removeNode(depth, index)
       const newNode = new SilNode(values[0], depth, index)      
       newNode._children = values.slice(1, values.length).map((value, index) => {
            return new SilNode<T>(value, index, depth + 1)
       })
       this.insertNode(depth, index, newNode)       
    }

    /**
     * TODO NEED TO UPGRADE THIS
     * Function that updates the concrete level of the silmaril nodes
     *  by inserting new node to the defined position
     * @param depth of the silmaril
     * @param index position where the node will be inserted
     * @param newChild the node
     */
    private insertNode(depth: number, index: number, node: SilNode<T>): void {
        // const formerNode = this.getNode(depth, index)      
        if(this.getLevelNodes(depth)) {
            // const parent = this.getLevelNodes(depth - 1).find(n => n._children.includes(formerNode))
            // this.getLevelNodes(depth - 1).find(n => n._children.includes(formerNode))._children 
            //     .splice(parent._children.indexOf(formerNode), 0, node)
            const source = [...this.getLevelNodes(depth)]    
            source.splice(index, 0, node);
            this._levels.set(depth, source)
        } else {
            this._levels.set(depth, [node])
        } 
        if(node._children) {
            node._children.forEach(child => this.addNewNode(child._value, node))
        }
    }

    /**
     * Function that adds new silmaril node to the parent-node.
     * If parent node is not defined, it will add the node
     * to default parent - root-node
     * @param value of the node
     * @param destNode parent-node
     */
    private addNewNode(value: T, destNode?: SilNode<T>): void {
        const newNode = new SilNode(value)
        newNode._children = []
        if(!this._root) {            
            newNode._index = newNode._depth = 0                 
            this._root = newNode        
            this.insertNode(newNode._depth, 0, newNode)                                     
        } else {           
            if(destNode) {                   
                destNode._children.push(newNode)                              
                newNode._depth = destNode._depth + 1           
                newNode._index = (this.getLevelNodes(newNode._depth)) 
                    ? this.getLevelNodes(newNode._depth).length 
                    : destNode._children.length - 1 
                this.insertNode(newNode._depth, newNode._index, newNode)          
            } else {
                this._root._children.push(newNode)             
                newNode._depth = this._root._depth + 1   
                newNode._index = this._root._children.length - 1                     
                this.insertNode(newNode._depth, newNode._index, newNode)                             
            }         
        }     
    }   

    /**
     * Function that upgrades all silmaril nodes indexes according to their level's position
     * @param depth 
     */
    private updateIndexes(depth: number): void {
        this.getLevelNodes(depth).map((node: SilNode<T>, index: number) => node._index = index)
    }
}

