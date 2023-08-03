import { Point } from '../util/point';
import type { NodeGeometry, Indexable } from './types';
import { fourPointForRotatedRectangle } from '../util/bounding-box';

/**
 * Rectangle Geometry
 * @beta
 * 
 * @remarks
 * This interface simply represents a rectangle geometry.
 */
export interface RectangleGeometry {

    /**
     * X start of the rectangle (top left).
     */
    x: number

    /**
     * Y start of the rectangle (top left).
     */
    y: number

    /**
     * Width of the rectangle.
     */
    width: number

    /**
     * Height of the rectangle.
     */
    height: number

    rotate: number
}

/**
 * Rectangle Constructor Properties
 * @beta
 * @typeParam CustomDataType - Type of the custom data property (optional, inferred automatically).
 */
export interface RectangleProps<IdType> extends RectangleGeometry {

    /**
     * Custom data
     */
    id?: IdType;
}

/**
 * Class representing a Rectangle
 * @typeParam CustomDataType - Type of the custom data property (optional, inferred automatically).
 * 
 * @example Without custom data (JS/TS):
 * ```typescript
 * const rectangle = new Rectangle({ 
 *   x: 10, 
 *   y: 20, 
 *   width: 30,
 *   height: 40,
 * });
 * ```
 * 
 * @example With custom data (JS/TS):
 * ```javascript
 * const rectangle = new Rectangle({ 
 *   x: 10, 
 *   y: 20, 
 *   width: 30,
 *   height: 40,
 *   data: { 
 *     name: 'Jane', 
 *     health: 100,
 *   },
 * });
 * ```
 * 
 * @example With custom data (TS):
 * ```typescript
 * interface ObjectData {
 *   name: string
 *   health: number
 * }
 * const entity: ObjectData = {
 *   name: 'Jane',
 *   health: 100,
 * };
 * 
 * // Typescript will infer the type of the data property
 * const rectangle1 = new Rectangle({
 *   x: 10, 
 *   y: 20, 
 *   width: 30,
 *   height: 40,
 *   data: entity,
 * });
 * 
 * // You can also pass in a generic type for the data property
 * const rectangle2 = new Rectangle<ObjectData>({ 
 *   x: 10, 
 *   y: 20, 
 *   width: 30,
 *   height: 40,
 * });
 * rectangle2.data = entity;
 * ```
 * 
 * @example With custom class extending Rectangle (implements {@link RectangleGeometry} (x, y, width, height)):
 * ```javascript
 * // extending inherits the qtIndex method
 * class Box extends Rectangle {
 *   
 *   constructor(props) {
 *     // call super to set x, y, width, height (and data, if given)
 *     super(props);
 *     this.content = props.content;
 *   }
 * }
 * 
 * const box = new Box({
 *   content: 'Gravity Boots',
 *   x: 10, 
 *   y: 20, 
 *   width: 30,
 *   height: 40,
 * });
 * ```
 * 
 * @example With custom class and mapping {@link RectangleGeometry}:
 * ```javascript
 * // no need to extend if you don't implement RectangleGeometry
 * class Box {
 *   
 *   constructor(content) {
 *     this.content = content;
 *     this.position = [10, 20];
 *     this.size = [30, 40];
 *   }
 *   
 *   // add a qtIndex method to your class
 *   qtIndex(node) {
 *     // map your properties to RectangleGeometry
 *     return Rectangle.prototype.qtIndex.call({
 *       x: this.position[0],
 *       y: this.position[1],
 *       width: this.size[0],
 *       height: this.size[1],
 *     }, node);
 *   }
 * }
 * 
 * const box = new Box('Gravity Boots');
 * ```
 * 
 * @example With custom object that implements {@link RectangleGeometry}:
 * ```javascript
 * const player = {
 *   name: 'Jane', 
 *   health: 100,
 *   x: 10, 
 *   y: 20, 
 *   width: 30,
 *   height: 30,
 *   qtIndex: Rectangle.prototype.qtIndex,
 * });
 * ```
 * 
 * @example With custom object and mapping {@link RectangleGeometry}:
 * ```javascript
 * // Note: this is not recommended but possible. 
 * // Using this technique, each object would have it's own qtIndex method. 
 * // Rather add qtIndex to your prototype, e.g. by using classes like shown above.
 * const player = {
 *   name: 'Jane', 
 *   health: 100,
 *   position: [10, 20], 
 *   size: [30, 40], 
 *   qtIndex: function(node) {
 *     return Rectangle.prototype.qtIndex.call({
 *       x: this.position[0],
 *       y: this.position[1],
 *       width: this.size[0],
 *       height: this.size[1],
 *     }, node);
 *   },
 * });
 * ```
 */
export class Rectangle<IdType> implements RectangleGeometry, Indexable {

    /**
     * X start of the rectangle (top left).
     */
    x: number;

    /**
     * Y start of the rectangle (top left).
     */
    y: number;

    /**
     * Width of the rectangle.
     */
    width: number;

    /**
     * Height of the rectangle.
     */
    height: number;

    rotate: number;

    /**
     * Custom data.
     */
    id?: IdType;

    constructor(props: RectangleProps<IdType>) {
        this.x = props.x;
        this.y = props.y;
        this.width = props.width;
        this.height = props.height;
        this.rotate = props.rotate;
        this.id = props.id;
    }

    isCollide(other: Rectangle<IdType>): boolean {
        const thisRight = this.x + this.width;
        const thisBottom = this.y + this.height;
        const otherRight = other.x + other.width;
        const otherBottom = other.y + other.height;

        // Check if the rectangles overlap along the X-axis
        if (this.x < otherRight && thisRight > other.x) {
            // Check if the rectangles overlap along the Y-axis
            if (this.y < otherBottom && thisBottom > other.y) {
                // If both overlap on both axes, they collide
                return true;
            }
        }

        // If there is no overlap along either axis, they don't collide
        return false;
    }

    /**
     * Determine which quadrant this rectangle belongs to.
     * @param node - Quadtree node to be checked
     * @returns Array containing indexes of intersecting subnodes (0-3 = top-right, top-left, bottom-left, bottom-right)
     */
    qtIndex(node: NodeGeometry): number[] {
        const [topLeft, topRight, bottomLeft, bottomRight] = fourPointForRotatedRectangle({ x: this.x, y: this.y }, { w: this.width, h: this.height }, this.rotate);

        const indexes: number[] = [],
            w2 = node.width / 2,
            h2 = node.height / 2,
            x2 = node.x + w2,
            y2 = node.y + h2;

        //an array of node origins where the array index equals the node index
        const nodes = [
            [x2, node.y],
            [node.x, node.y],
            [node.x, y2],
            [x2, y2],
        ];

        //test all nodes for line intersections
        for (let i = 0; i < nodes.length; i++) {
            if (
                Rectangle.intersectRect(topLeft, topRight, nodes[i][0], nodes[i][1], nodes[i][0] + w2, nodes[i][1] + h2) ||
                Rectangle.intersectRect(topRight, bottomRight, nodes[i][0], nodes[i][1], nodes[i][0] + w2, nodes[i][1] + h2) ||
                Rectangle.intersectRect(bottomRight, bottomLeft, nodes[i][0], nodes[i][1], nodes[i][0] + w2, nodes[i][1] + h2) ||
                Rectangle.intersectRect(bottomLeft, topLeft, nodes[i][0], nodes[i][1], nodes[i][0] + w2, nodes[i][1] + h2)
            ) {
                indexes.push(i);
            }
        }

        return indexes;
    }

    static intersectRect(p1: Point, p2: Point, minX: number, minY: number, maxX: number, maxY: number): boolean {

        // Completely outside
        if ((p1.x <= minX && p2.x <= minX) || (p1.y <= minY && p2.y <= minY) || (p1.x >= maxX && p2.x >= maxX) || (p1.y >= maxY && p2.y >= maxY))
            return false;

        // Single point inside
        if ((p1.x >= minX && p1.x <= maxX && p1.y >= minY && p1.y <= maxY) || (p2.x >= minX && p2.x <= maxX && p2.y >= minY && p2.y <= maxY))
            return true;

        const m = (p2.y - p1.y) / (p2.x - p1.x);

        let y = m * (minX - p1.x) + p1.y;
        if (y > minY && y < maxY) return true;

        y = m * (maxX - p1.x) + p1.y;
        if (y > minY && y < maxY) return true;

        let x = (minY - p1.y) / m + p1.x;
        if (x > minX && x < maxX) return true;

        x = (maxY - p1.y) / m + p1.x;
        if (x > minX && x < maxX) return true;

        return false;
    }
}