import { ItemRecord } from '../item/item';
import Box, { BoxProps } from '../item/box';
import Visitor, { VisitorBase } from './visitor';
import Photo, { PhotoProps } from '../item/photo';
import Obstacle, { ObstacleState } from '../item/obstacle';
import Description, { DescriptionProps } from '../item/description';

class ExportVisitor extends VisitorBase implements Visitor {
    private _records: ItemRecord[] = [];

    visitBox(box: Box): void {
        const data: BoxProps = {
            id: box.id,
            pos: box.pos,
            size: box.size,
            rotate: box.rotate,
            name: box.name
        };
        this._records.push({
            type: Box.typeId,
            data: data
        });
    }

    visitDescription(description: Description): void {
        const data: DescriptionProps = {
            id: description.id,
            pos: description.pos,
            rotate: description.rotate,
            text: description.text,
            fontSize: description.fontStyle.size
        };
        this._records.push({
            type: Description.typeId,
            data: data
        });
    }

    visitObstacle(obstacle: Obstacle): void {
        const data: ObstacleState = {
            id: obstacle.id,
            pos: obstacle.pos,
            size: obstacle.size,
            rotate: obstacle.rotate
        };
        this._records.push({
            type: Obstacle.typeId,
            data: data
        });
    }

    visitPhoto(photo: Photo): void {
        const data: PhotoProps = {
            id: photo.id,
            pos: photo.pos,
            size: photo.size,
            rotate: photo.rotate,
            url: photo.url
        };
        this._records.push({
            type: Photo.typeId,
            data: data
        });
    }

    getResult(): ItemRecord[] {
        return this._records;
    }
}

export default ExportVisitor;