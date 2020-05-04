# Boggle

## Primer / Refresher

Word game involving a grid of die where the objective is to find as many words on the grid following sequences of adjacent die.

* You can create words connecting die in any direction as long as you do not reuse any die.
* The words you create must be at least 3 letters long and may not be a proper name, abbreviation, contraction, 
  hyphenated word or foreign word not in the English dictionary.
* Same words found along different sequences or which have multiple meanings do not earn extra credit.

You have 3 minutes to find words. When the time is up, all players crosses off common words found by any other player.
From the remaining set of words, you earn points for each word based on their length: 
3-4 letters is 1, 8 or more letters is 11.

The winner is the person who scores the most points or who reached an agreed upon total first.

## Strategies / Questions

What are the longest, least common words? 

What is the complete set of words that can be made from a set of dice? 

## Problem

There's somewhere between many trillions up to septillions (10^24) of board combinations for a set of die.
It would be impossible to compute the word list of every single board, filter those words and store them in a master
Boggle dictionary.

## Trihack

Can I at determine if a word is on a Boggle board and in a dictionary in real time?
Foundation for online multiplayer Boggle.

1. What dictionary should I choose?
1. How do I store and access the dictionary?
1. How can I check if a word is in the dictionary?
1. How to determine if a word is on a board?
    1. How to represent a Boggle board?
    1. Can I precompute the list of words playable on the Boggle board?
    
## Dictionary
Maintaining my own word db + REST API seemed like overkill. 
Best third party APIs were charging per request.

Chose the latest official Scrabble Dictionary because Scrabble has the same rules as Boggle and because the dictionary
is readily available.

How can I represent and look up the dictionary in memory in the Browser?

Trie - Wrote my own word prefix tree

MAXIMUM CALL STACK EXCEEDED - In retrospect, probably due to bugs in my implementation

DAWG - Deterministic acyclic finite state automaton or Directed acyclic word graph. Like a Trie, except suffixes are indexed.

Running out of time, so I search npm for word graph libraries and came across dawg-lookup.
This library not only only created these word graphs, it also output them into a compressed 7-bit ascii format storing and
creating. 

Took the dictionary, constructed a DAWG, and saved the output to a file.
This shrunk to dictionary from >3MB to < 600k. Not only that but it takes < 3ms to load the dictionary from a txt file
and create an in-memory DAWG, plus it takes .001 ms to lookup a word.

## Boggle

Created a class which has a board represented as a 4x4 multi-dimensional array (matrix). 

Attempted to precompute a Trie/DAWG of all possible words on the board but this takes ~2mins per board which is not an
acceptable wait time IMO.

I precompute a map of letters to positions on the matrix as well as a map of positions to adjacent positions.

From there, I created an `isWord` method which checks the dictionary for the word before recursively traversing the matrix using the starting positions
along with the neighbor lookup.
