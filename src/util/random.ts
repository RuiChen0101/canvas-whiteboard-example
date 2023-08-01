import { customAlphabet } from 'nanoid';

class Random {
    public nanoid8(): string {
        const nano8 = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 8);
        return nano8();
    }

    public nanoid16(): string {
        const nano16 = customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz', 16);
        return nano16();
    }
}

export default Random;