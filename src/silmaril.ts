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

    constructor(value: T) {
        this._value = value
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
    public getNode(level: number, index: number): SilNode<T> {
        return this.getLevelNodes(level).find((node: SilNode<T>) => node._index === index)
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
    public addNodes(values: T[], depth?: number, index?: number) {
        values.forEach(value => this.addNode(value, depth, index))
    }
    
    /**
     * Function that updates the concrete level of the silmaril nodes
     *  by inserting new node to the defined position
     * @param depth of the silmaril
     * @param index position where the node will be inserted
     * @param newChild the node
     */
    private updateLevel(depth: number, index: number, newChild: SilNode<T>) {            
        if(this.getLevelNodes(depth)) {
            const source = [...this.getLevelNodes(depth)]    
            source.splice(index, 0, newChild);
            this._levels.set(depth, source)
        } else {
            this._levels.set(depth, [newChild])
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
            this.updateLevel(newNode._depth, 0, newNode)                                     
        } else {           
            if(destNode) {                   
                destNode._children.push(newNode)                              
                newNode._depth = destNode._depth + 1           
                newNode._index = (this.getLevelNodes(newNode._depth)) 
                    ? this.getLevelNodes(newNode._depth).length 
                    : destNode._children.length - 1 
                this.updateLevel(newNode._depth, newNode._index, newNode)          
            } else {
                this._root._children.push(newNode)             
                newNode._depth = this._root._depth + 1   
                newNode._index = this._root._children.length - 1                     
                this.updateLevel(newNode._depth, newNode._index, newNode)                             
            }         
        }     
    }
}





