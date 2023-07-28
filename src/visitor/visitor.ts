import Booth from '../item/booth';
import Table from '../item/table';

interface Visitor {
    visitTable(table: Table): void
    visitBooth(booth: Booth): void
}

abstract class VisitorBase implements Visitor {
    visitTable(table: Table): void { }
    visitBooth(booth: Booth): void { }
}

export default Visitor;
export { VisitorBase };