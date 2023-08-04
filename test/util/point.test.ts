import 'mocha';
import { expect } from 'chai';

import { rotatePoint } from '../../src/util/point';

describe('point', () => {
    it('should rotate point', () => {
        const p1 = rotatePoint({ x: 200, y: 100 }, { x: 200, y: 150 }, 0);
        expect(p1).to.be.deep.equal({ x: 200, y: 100 });
    });
});