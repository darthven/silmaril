// TODO write tests here
import Silmaril from '../src/silmaril'
import { assert } from 'chai';
import 'mocha';


function checkChildrenAfterInsertions<T>(silmaril: Silmaril<T>, depth: number): void {
  const level = silmaril.getLevelNodes(depth)
  if(level && level.length > 0) {   
    level.forEach((node, index) => {  
      assert.deepEqual(node, silmaril.getNode(node._depth, node._index)) 
        if(node._children && node._children.length > 0) {
          checkChildrenAfterInsertions(silmaril, node._depth - 1)    
        }          
    })    
  }  
}

function viewSilmaril<T>(silmaril: Silmaril<T>): void {
  silmaril.levels.forEach((nodes, depth) => {
    console.log(`LEVEL ${depth}: ${JSON.stringify(nodes, null, 3)}`)
  })   
}

function viewSilmarilValues<T>(silmaril: Silmaril<T>): void {
  silmaril.levels.forEach((nodes, depth) => {
    const values = nodes.map(node => node._value)
    console.log(`LEVEL ${depth}: ${JSON.stringify(values)}`)
  })  
  console.log(`==============================================`)
}


describe('Silmaril', () => {
  const silmaril = new Silmaril<number>()
  it('Insertions test', () => {
    silmaril.addNodes([1, 2, 3, 4])
    viewSilmarilValues(silmaril)
    assert.deepEqual(silmaril.root, silmaril.getNode(0, 0))  
    assert.equal(silmaril.getLevelNodes(0).length, 1) 
    assert.equal(silmaril.getLevelNodes(1).length, 3) 

    silmaril.addNodes([5, 6, 7], 1, 0)
    viewSilmarilValues(silmaril)
    assert.equal(silmaril.getNode(1, 0)._children.length, 3)
    assert.equal(silmaril.getLevelNodes(2).length, 3) 

    silmaril.addNodes([8, 9, 10], 1, 1)
    viewSilmarilValues(silmaril)
    assert.equal(silmaril.getNode(1, 1)._children.length, 3)
    assert.equal(silmaril.getLevelNodes(2).length, 6) 

    silmaril.addNodes([11, 12, 13], 1, 2)
    viewSilmarilValues(silmaril)
    assert.equal(silmaril.getNode(1, 2)._children.length, 3)
    assert.equal(silmaril.getLevelNodes(2).length, 9) 

    silmaril.addNodes([21, 22, 23, 24])
    viewSilmarilValues(silmaril)
    assert.equal(silmaril.getNode(0, 0)._children.length, 7)
    assert.equal(silmaril.getLevelNodes(1).length, 7) 

    silmaril.addNode(111, 0, 0)
    viewSilmarilValues(silmaril)
    assert.equal(silmaril.getNode(0, 0)._children.length, 8)
    assert.equal(silmaril.getLevelNodes(1).length, 8) 

    // Check all nodes after insertion
    checkChildrenAfterInsertions(silmaril, 0)    
    // viewSilmaril(silmaril)
  })
  it('Updating test', () => {
    // TODO NEED FIX
    // silmaril.replaceNode(1, 2, [345, 346, 347, 348, 349])
    // viewSilmarilValues(silmaril)  
    // viewSilmaril(silmaril)
    // assert.equal(silmaril.getNode(1, 2)._value, 345)
    //   assert.includeDeepMembers(silmaril.getLevelNodes(2).map(node => node._value), [346, 347, 348, 349])   
  })
  it('Deletions test', () => {
    // Making a copy of neighbour-node
    let childCopy = silmaril.getNode(1, 1)   
    // Changing index of neighbour-node to the first one  
    childCopy._index = 0
    // Making a copy of children that will be removed
    let childrenToRemove = silmaril.getNode(1, 0)._children      
    silmaril.removeNode(1, 0)    
    viewSilmarilValues(silmaril)  
    assert.deepEqual(childCopy, silmaril.getNode(1, 0))       
    assert.equal(childCopy._index, 0)   
    assert.notIncludeDeepOrderedMembers(silmaril.getLevelNodes(childCopy._depth - 1), childrenToRemove)

    // Making a copy of neighbour-node again
    childCopy = silmaril.getNode(2, 4)
    // Changing index of neighbour-node to the first one  
    childCopy._index = 0
    // Making a copy of children that will be removed
    childrenToRemove = [silmaril.getNode(2, 0), silmaril.getNode(2, 1), silmaril.getNode(2, 2), silmaril.getNode(2, 3)]
    // Removing nodes from positions 0-4 (4 not included)
    silmaril.removeNodes(2, 0, 4)     
    viewSilmarilValues(silmaril)   
    assert.deepEqual(childCopy, silmaril.getNode(2, 0))       
    assert.equal(childCopy._index, 0)   
    assert.notIncludeDeepOrderedMembers(silmaril.getLevelNodes(childCopy._depth - 1), childrenToRemove)

    // Removing the whole level of silmaril
    silmaril.clearLevel(1)    
    viewSilmarilValues(silmaril)
    assert.deepEqual(silmaril.root._children, [])
    assert.deepEqual(silmaril.getLevelNodes(1), [])
    assert.deepEqual(silmaril.getLevelNodes(2), [])    
    viewSilmaril(silmaril)
  })
})

