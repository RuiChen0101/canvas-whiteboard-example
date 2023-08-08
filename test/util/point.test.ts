import 'mocha';
import { expect } from 'chai';

import { pointAngle, rotatePoint } from '../../src/util/point';

describe('point', () => {
    it('should rotate point', () => {
        const p1 = rotatePoint({ x: 200, y: 100 }, { x: 200, y: 150 }, 0);
        expect(p1).to.be.deep.equal({ x: 200, y: 100 });
    });

    it('should get degree between two vector', () => {
        const degree1 = pointAngle({ x: 1, y: 1 }, { x: 1, y: 1 });
        expect(degree1).to.be.approximately(0, 0.001);

        const degree2 = pointAngle({ x: 0, y: 1 }, { x: 1, y: 1 });
        expect(degree2).to.be.approximately(-45, 0.001);

        const degree3 = pointAngle({ x: -50.452999789226624, y: 140.24933678638462 }, { x: -50.452999789226624, y: 140.24933678638462 });
        expect(degree3).to.be.approximately(0, 0.001);
    });
});