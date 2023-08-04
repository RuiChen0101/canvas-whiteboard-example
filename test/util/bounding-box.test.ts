import 'mocha';
import { expect } from 'chai';

import { isRectangleCollide } from '../../src/util/bounding-box';

describe('bounding box', () => {
    it('should test two bounding box is collide', () => {
        const isCollide1 = isRectangleCollide(
            { x: 1000, y: 500 }, { w: 200, h: 100 }, 0,
            { x: 1300, y: 500 }, { w: 350, h: 190 }, 0
        )
        expect(isCollide1).to.be.false;

        const isCollide2 = isRectangleCollide(
            { x: 1000, y: 500 }, { w: 200, h: 100 }, 0,
            { x: 1100, y: 599 }, { w: 90, h: 123 }, 0
        )
        expect(isCollide2).to.be.true;
    });
});