// TODO write tests here
import Silmaril from '../src/silmaril'
import { expect } from 'chai';
import 'mocha';

describe('Hello function', () => {
  it('some tests here', () => {
    const silmaril = new Silmaril<number>();

    silmaril.addNodes([1, 2, 3, 4])

    silmaril.addNodes([5, 6, 7], 1, 0)
    silmaril.addNodes([8, 9, 10], 1, 1)
    silmaril.addNodes([11, 12, 13], 1, 2)

    silmaril.addNodes([21, 22, 23, 24])

    silmaril.addNode(111, 0, 1)

    console.log('LEVEL 0', silmaril.getLevelNodes(0))
    console.log('LEVEL 1', silmaril.getLevelNodes(1))
    console.log('LEVEL 2', silmaril.getLevelNodes(2))

    console.log('SEARCH', silmaril.getNode(1, 2))
  });
});

