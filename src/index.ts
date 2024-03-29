import * as CrypytoJS from "crypto-js"

class Block {
    public index: number;
    public hash: string;
    public previousHash: string;
    public data: string;
    public timestamp: number;

    static calculateBlockHash = (
        index: number,
        previousHash: string,
        data: string,
        timestamp: number
    ): string =>
        CrypytoJS.SHA256(index + previousHash + data + timestamp.toString()).toString()

    static validateStructure = (blockCandidate: Block): boolean => 
            typeof blockCandidate.index === "number" &&
            typeof blockCandidate.hash === "string" &&
            typeof blockCandidate.previousHash === "string" &&
            typeof blockCandidate.data === "string" &&
            typeof blockCandidate.timestamp === "number"

    constructor(
        index: number,
        hash: string,
        previousHash: string,
        data: string,
        timestamp: number
    ) {
        this.index = index;
        this.hash = hash;
        this.previousHash = previousHash;
        this.data = data;
        this.timestamp = timestamp;
    }
}

const genesisBlock: Block = new Block(0, "2020200202020", "", "Hello", 123456)

let blockChain: [Block] = [genesisBlock]

const getBlockchain = (): Block[] => blockChain;

const getLatestBlock = (): Block => blockChain[blockChain.length - 1];

const getNewTimeStamp = (): number => Math.round(new Date().getTime() / 1000);

const createNewBlock = (data: string): Block => {
    const previousBlock: Block = getLatestBlock();
    const newIndex: number = previousBlock.index + 1;
    const nextTimestamp: number = getNewTimeStamp();
    const nextHash: string = Block.calculateBlockHash(
        newIndex,
        previousBlock.hash,
        data,
        nextTimestamp
    );
    const newBlock: Block = new Block(
        newIndex,
        nextHash,
        previousBlock.hash,
        data,
        nextTimestamp);
    addBlock(newBlock);// push new Block to blockchain when creating new block
    return newBlock;
}

const getBlockHash = (block: Block): string => Block.calculateBlockHash(
    block.index,
    block.previousHash,
    block.data,
    block.timestamp
    )

const isBlockValid = (candidateBlock: Block, previousBlock: Block): boolean => {
    if (!Block.validateStructure(candidateBlock)) return false;
    else if (previousBlock.index + 1 !== candidateBlock.index) return false;
    else if (previousBlock.hash !== candidateBlock.previousHash) return false;
    else if (candidateBlock.hash !== getBlockHash(candidateBlock)) return false;
    return true;
}

const addBlock = (candidateBlock:Block):void => {
    if(isBlockValid(candidateBlock, getLatestBlock())) {
        blockChain.push(candidateBlock)
    }
}

// test code area

createNewBlock("secondBlock");
createNewBlock("thirdBlock");
createNewBlock("fourthBlock");

console.log(getBlockchain());

// test code area
export { };
