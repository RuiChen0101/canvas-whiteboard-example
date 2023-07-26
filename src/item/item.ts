import Visitor from '../visitor/visitor';

interface Item {
    visit(visitor: Visitor): void;
}

export default Item;