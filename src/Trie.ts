export class TrieNode<T>  {
    key: string;
    value: T;
    parent?: TrieNode<T>;
    children: { [key: string]: TrieNode<T> } = {};
    constructor(key: string, value: T, parent?: TrieNode<T>) {
        this.key = key;
        this.value = value;
        this.parent = parent;
    }
    addChild(child: TrieNode<T>) {
        this.children[child.key] = child;
    }
    isEnd(): boolean {
        return Object.keys(this.children).length == 0;
    }
}

export class Trie<T> {
    root: TrieNode<T>;
    constructor(root: TrieNode<T>) {
        this.root = root;
    }
}
