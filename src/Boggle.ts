import { readFileSync } from 'fs';
import { resolve } from 'path';

import { VINTAGE_BOOKSHELF_2019, Dice } from './Dice';
import { Matrix } from './Matrix';
import { shuffle } from './util/shuffle';

const { Trie, PTrie } = require('dawg-lookup');

export type Coordinate = [number, number];
export type Board = Matrix<string>;
export type LetterMap = { [letter: string]: Set<number> };
export type NeighborMap = { [position: number]: Set<number> };

const moves: Coordinate[] = [
  [0, -1], // N
  [1, -1], // NE
  [1, 0], // E
  [1, 1], // SE
  [0, 1], // S
  [-1, 1], // SW
  [-1, 0], // W
  [-1, -1] // NW
];

export const dictionary = new PTrie(readFileSync(resolve(__dirname, '../lib', 'packed-dictionary.txt'), 'utf-8'));

export function points(word: string): number {
  var length = word.length;
  if (length <= 2) {
    return 0;
  } else if (length <= 4) {
    return 1;
  } else if (length === 5) {
    return 2;
  } else if (length === 6) {
    return 3;
  } else if (length === 7) {
    return 5;
  } else {
    return 11;
  }
}

export function score(words: Set<string>): number {
  var score = 0;
  for (let word of words.values()) {
    score += points(word);
  }
  return score;
}

export class Boggle {
  static dice = VINTAGE_BOOKSHELF_2019;

  board: Board;
  letters: LetterMap;
  neighbors: NeighborMap;

  constructor(dice: Dice = Boggle.dice) {
    dice = shuffle(dice.slice()) as Dice;
    let size = Math.sqrt(dice.length);
    this.letters = {};
    this.neighbors = {};
    this.board = Array.from(new Array(size), (_, row) => {
      return Array.from(Array(size), (_, column) => {
        let position = size * row + column;
        this.neighbors[position] = new Set<number>();
        moves.forEach((move: Coordinate) => {
          let neighboringRow = row + move[0];
          let neighboringColumn = column + move[1];
          if (neighboringRow >= 0
            && neighboringRow < size
            && neighboringColumn >= 0
            && neighboringColumn < size) {
            let neighborPosition = size * neighboringRow + neighboringColumn;
            this.neighbors[position].add(neighborPosition);
          }
        });
        let die = dice[position];
        let letter = die.charAt(Math.floor(Math.random() * size));
        if (this.letters.hasOwnProperty(letter)) {
          this.letters[letter].add(position);
        } else {
          this.letters[letter] = new Set([position]);
        }
        return letter;
      });
    });
  }

  isWord(word: string): boolean {
    word = word.toLowerCase();

    // this means it is:
    // 1. only characters a-z
    // 2. between 3 and 16 letters in length
    // 3. contains the letter 'q' where 'q' is not followed by 'u'
    // 4. in the dictionary
    console.time('check dictionary');
    let isDictionaryWord = dictionary.isWord(word);
    console.timeEnd('check dictionary');
    if (!isDictionaryWord) {
      return false;
    }

    const traverse = (word: string, visited: Set<number> = new Set<number>(), lastPosition?: number): boolean => {
      if (word.length === 0) {
        return true;
      }
      if (!this.letters.hasOwnProperty(word.charAt(0))) {
        return false;
      }
      if (!lastPosition) {
        for (let position of (this.letters[word.charAt(0)] || [])) {
          visited.add(position);
          if (traverse(word.slice(1), visited, position)) {
            return true;
          } else {
            visited.delete(position);
          }
        }
      } else {
        for (let position of (this.letters[word.charAt(0)] || [])) {
          if (this.neighbors[lastPosition].has(position) && !visited.has(position)) {
            visited.add(position);
            if (traverse(word.slice(1), visited, position)) {
              return true;
            } else {
              visited.delete(position);
            }
          }
        }
      }
      return false;
    };

    console.time('check board');
    let isBoardWord = traverse(word.replace('qu', 'q'));
    console.timeEnd('check board');

    return isBoardWord;
  }
}

