:- use_module(library(lists)).
:- use_module(library(random)).

board_start([
			[' ',' ',' ',' ',' ','x',' ','x',' ','x',' ','x',' ','x',' ',' ',' ',' ',' '],
			[' ',' ',' ',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ',' ',' ',' '],
			[' ',' ',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ',' ',' '],
			[' ',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ',' '],
			[' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' '],
			['x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x'],
			[' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' '],
			[' ',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ',' '],
			[' ',' ',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ',' ',' '],
			[' ',' ',' ',' ','x',' ','x',' ','x',' ','x',' ','x',' ','x',' ',' ',' ',' '],
			[' ',' ',' ',' ',' ','x',' ','x',' ','x',' ','x',' ','x',' ',' ',' ',' ',' ']
			]).

gameMode(1). %Player vs Player
gameMode(2). %Player vs CPU
gameMode(3). %CPU vs CPU

difficulty(1).
difficulty(2).

turnPiece(1, 'B').
turnPiece(2, 'P').

reversePiece(1, 'P').
reversePiece(2, 'B').

reverseTurn(1, 2).
reverseTurn(2, 1).

switchCase('B','b').
switchCase('P','p').


/*  game logic  */

/*Starting function*/
newGame:-
nl, write('Bem-vindo ao Boku, jogo desenhado por Nelson Almeida e Jose Luis.'),nl,nl,
write('As casas livres sao representadas por "x", as pecas brancas sao representadas por "B" e as pretas por "P", sendo que comecam as brancas.'),nl,nl,
getGameMode(GameMode), newGame(GameMode).

/*Reads gamemode*/
getGameMode(GameMode):- 
write('1. Humano vs Humano'),nl, write('2. Humano vs CPU'),nl, write('3. CPU vs CPU'), nl, write('Mode de Jogo: '),
read(GameMode), nl, gameMode(GameMode).
getGameMode(GameMode):- write('Modo invalido!'), nl, nl, getGameMode(GameMode).

/*Reads CPU difficulty*/
getDifficulty(Difficulty):-
write('1. Facil'),nl, write('2. Dificil'),nl, 
write('Dificuldade: '), read(Difficulty), nl, 
difficulty(Difficulty).
getDifficulty(Difficulty):- write('Dificuldade invalida!'), nl, nl, getDifficulty(GameMode).

/*Starts Human vs Human mode*/
newGame(1):-
write('Modo Humano vs Humano'),nl, write('O Jogador1 sera as pecas brancas "B".'), nl, write('O Jogador2 sera as pecas pretas "P".'), nl, nl,
board_start(A), player1Turn(A, 0).


player1Turn(Board, 1):-
printBoard(Board),
write('Vitoria do Jogador2'), nl.

player1Turn(Board, 2):-
printBoard(Board),
write('Empate'), nl.

/*Human vs Human mode, Player 1 turn*/
player1Turn(Board, End):-
write('Turno do Jogador1 - Brancas'), nl,
printBoard(Board), 
playHuman(Board, NewBoard, 1), nl,
checkEndOfGame(NewBoard, 0, 1, 0, Ret),
player2Turn(NewBoard, Ret).



player2Turn(Board, 1):-
printBoard(Board),
write('Vitoria do Jogador1'), nl.

player2Turn(Board, 2):-
printBoard(Board),
write('Empate'), nl.

/*Human vs Human mode, Player 2 Turn*/
player2Turn(Board, End):-
write('Turno do Jogador2 - Pretas'), nl,
printBoard(Board), 
playHuman(Board, NewBoard, 2), nl,
checkEndOfGame(NewBoard, 0, 2, 0, Ret),
player1Turn(NewBoard, Ret).


/*Starts Human vs CPU mode*/
newGame(2):-
write('Modo Humano vs Computador'),nl, 
write('Selecione a dificuldade do Computador'), nl, getDifficulty(Difficulty),
write('O Humano sera as pecas brancas "B".'), nl, write('O Computador sera as pecas pretas "P".'), nl, nl,
board_start(A), humanTurn(A, Difficulty, 0).


humanTurn(Board, CPUDifficulty, 1):-
printBoard(Board),
write('Vitoria do Computador'), nl.

humanTurn(Board, CPUDifficulty, 2):-
printBoard(Board),
write('Empate'), nl.

/*Human vs CPU mode, Human Turn*/
humanTurn(Board, CPUDifficulty, End):-
write('Turno do Humano - Brancas'), nl,
printBoard(Board), 
playHuman(Board, NewBoard, 1), nl,
checkEndOfGame(NewBoard, 0, 1, 0, Ret),
cpuTurn(NewBoard, CPUDifficulty, Ret).



cpuTurn(Board, CPUDifficulty, 1):-
printBoard(Board),
write('Vitoria do Humano'), nl.

cpuTurn(Board, CPUDifficulty, 2):-
printBoard(Board),
write('Empate'), nl.

/*Human vs CPU mode, CPU Turn*/
cpuTurn(Board, CPUDifficulty, End):-
write('Turno do Computador - Pretas'), nl,
printBoard(Board), 
playComputer(Board, NewBoard, 2, CPUDifficulty), nl,
checkEndOfGame(NewBoard, 0, 2, 0, Ret),
humanTurn(NewBoard, CPUDifficulty, Ret).



/*Starts CPU vs CPU mode*/
newGame(3):-
write('Modo Computador vs Computador'),nl, 
write('Selecione a dificuldade do Computador1'), nl, getDifficulty(Difficulty1),
write('Selecione a dificuldade do Computador2'), nl, getDifficulty(Difficulty2),
write('O Computdaor1 sera as pecas brancas "B".'), nl, write('O Computador2 sera as pecas pretas "P".'), nl, nl,
board_start(A), cpu1Turn(A, Difficulty1, Difficulty2, 0).


cpu1Turn(Board, CPU1Difficulty, CPU2Difficulty, 1):-
printBoard(Board),
write('Vitoria do Computador2'), nl.

cpu1Turn(Board, CPU1Difficulty, CPU2Difficulty, 2):-
printBoard(Board),
write('Empate'), nl.

/*CPU vs CPU mode, CPU1 Turn*/
cpu1Turn(Board, CPU1Difficulty, CPU2Difficulty, End):-
write('Turno do Computador1 - Brancas'), nl,
printBoard(Board), 
playComputer(Board, NewBoard, 1, CPU1Difficulty), nl,
checkEndOfGame(NewBoard, 0, 1, 0, Ret),
cpu2Turn(NewBoard, CPU1Difficulty, CPU2Difficulty, Ret).



cpu2Turn(Board, CPU1Difficulty, CPU2Difficulty, 1):-
printBoard(Board),
write('Vitoria do Computador1'), nl.

cpu2Turn(Board, CPU1Difficulty, CPU2Difficulty, 2):-
printBoard(Board),
write('Empate'), nl.

/*CPU vs CPU mode, CPU2 Turn*/
cpu2Turn(Board, CPU1Difficulty, CPU2Difficulty, End):-
write('Turno do Computador2 - Pretas'), nl,
printBoard(Board), 
playComputer(Board, NewBoard, 2, CPU2Difficulty), nl,
checkEndOfGame(NewBoard, 0, 2, 0, Ret),
cpu1Turn(NewBoard, CPU1Difficulty, CPU2Difficulty, Ret).



/*Read and apply move and captures if needed*/
playHuman(BoardIn, BoardOut, Turn):-
possibleMoves(BoardIn, PlayList),
getMove(PlayList, Move),
turnPiece(Turn, Piece),
applyMove(BoardIn, Move, TempBoard, Piece),
reversePiece(Turn, OpponentPiece),
clearCapture(TempBoard, 0, OpponentPiece, TempBoard2),
checkCapture(TempBoard2, Move, Turn, CaptureList),
applyCaptures(TempBoard2, CaptureList, Piece, BoardOut).

newComputerMove(Tabuleiro,Difficulty, Turn, Res) :- Difficulty == 1, write('facil'),nl, possibleMoves(Tabuleiro, PlayList), getRandomMove(PlayList, Res).
newComputerMove(Tabuleiro,Difficulty, Turn, Res) :- Difficulty == 2, write('dificil'),nl, possibleMoves(Tabuleiro, PlayList),
getBestMove(Tabuleiro, PlayList, Turn, [], DefensiveMove, 1, DefensiveSeq),
reverseTurn(Turn, OpponentTurn),
getBestMove(Tabuleiro, PlayList, OpponentTurn, [], OffensiveMove, -1, OffensiveSeq),
(DefensiveSeq > OffensiveSeq, DefensiveSeq >= 2->
	Res = DefensiveMove
;
	(OffensiveSeq == 0 ->
		getRandomMove(PlayList, Res)
	;
		Res = OffensiveMove
	)
).



/*  game AI  */
playComputer(BoardIn, BoardOut, Turn, 1):- playComputerEasy(BoardIn, BoardOut, Turn).
playComputer(BoardIn, BoardOut, Turn, 2):- playComputerHard(BoardIn, BoardOut, Turn).


/*Choose random CPU move (easy) and random capture if needed*/
playComputerEasy(BoardIn, BoardOut, Turn):-
possibleMoves(BoardIn, PlayList),
getRandomMove(PlayList, Move),
turnPiece(Turn, Piece),
applyMove(BoardIn, Move, TempBoard, Piece),
[Row, Column] = Move, write('O Computador jogou'), nl, write('Linha: '), write(Row), nl, write('Coluna: '), write(Column), nl,
reversePiece(Turn, OpponentPiece),
clearCapture(TempBoard, 0, OpponentPiece, TempBoard2),
checkCapture(TempBoard2, Move, Turn, CaptureList),
applyRandomCaptures(TempBoard2, CaptureList, Piece, BoardOut).


/*Choose best CPU move (hard) and random capture if needed*/
playComputerHard(BoardIn, BoardOut, Turn):-
possibleMoves(BoardIn, PlayList),
getBestMove(BoardIn, PlayList, Turn, [], DefensiveMove, 1, DefensiveSeq),
reverseTurn(Turn, OpponentTurn),
getBestMove(BoardIn, PlayList, OpponentTurn, [], OffensiveMove, -1, OffensiveSeq),
(DefensiveSeq >= OffensiveSeq, DefensiveSeq >= 2,  DefensiveSeq =< 3 ->
	Move = DefensiveMove
;
	(OffensiveSeq == 0 ->
		getRandomMove(PlayList, Move)
	;
		Move = OffensiveMove
	)
),
turnPiece(Turn, Piece),
applyMove(BoardIn, Move, TempBoard, Piece),
[Row, Column] = Move, write('O Computador jogou'), nl, write('Linha: '), write(Row), nl, write('Coluna: '), write(Column), nl,
reversePiece(Turn, OpponentPiece),
clearCapture(TempBoard, 0, OpponentPiece, TempBoard2),
checkCapture(TempBoard2, Move, Turn, CaptureList),
applyRandomCaptures(TempBoard2, CaptureList, Piece, BoardOut).




/*  Game change and analysis */


/*Returns list with valid positions to play*/
possibleMoves(Board, PlayList):- 
checkSpace(0, 0, [], Board, PlayList).

checkSpace(0, 19, PlayList, Board, Ret):- 
append([], PlayList, Ret).

checkSpace(11, Column, PlayList, Board, Ret):- 
NewColumn is Column+1, 
checkSpace(0, NewColumn, PlayList, Board, Ret).

/*Checks if given position is valid and if so, append it to a list that is returned*/
checkSpace(Row, Column, PlayList, Board, Ret):-
getPeca(Board, Row, Column, Piece),
updatePlayList(PlayList, Row, Column, Piece, NewPlayList),
NewRow is Row+1,
checkSpace(NewRow, Column, NewPlayList, Board, Ret).

updatePlayList(PlayList, Row, Column, 'x', NewPlayList):-
A = [[Row, Column]], 
append(PlayList, A, NewPlayList).

updatePlayList(PlayList, Row, Column, Piece, NewPlayList):- 
append(PlayList, [], NewPlayList).


/*Asks for a move until a valid one is given*/
getMove(PlayList, Move, Res):- member(Move, PlayList), Res is 1.
getMove(PlayList, Move, Res):- Res is 0.

maxListElem([], TempMax, Ret):- Ret is TempMax.

/*Returns max value of a given list*/
maxListElem(L, TempMax, Ret):-
[A|B] = L,
(A > TempMax ->
	TempMax2 = A
;
	TempMax2 = TempMax
),
maxListElem(B, TempMax2, Ret).


%getBestMove
getBestMove(Board, [], Turn, TempMove, Move, TempBiggestSeq, BiggestSeq):- Move = TempMove, BiggestSeq is TempBiggestSeq.

/*Returns best move out of all possible moves*/
getBestMove(Board, PlayList, Turn, TempMove, Move, TempBiggestSeq, BiggestSeq):-
[A|B] = PlayList, 
CurrCell = A,
reversePiece(Turn, Piece),
checkSeqRight(Board, Piece, CurrCell, 0, SeqRight),
checkSeqLeft(Board, Piece, CurrCell, 0, SeqLeft),
SeqHorizontal is SeqRight + SeqLeft,
checkSeqTopRight(Board, Piece, CurrCell, 0, SeqTopRight),
checkSeqBottomLeft(Board, Piece, CurrCell, 0, SeqBottomLeft),
SeqRightDiag is SeqTopRight + SeqBottomLeft,
checkSeqTopLeft(Board, Piece, CurrCell, 0, SeqTopLeft),
checkSeqBottomRight(Board, Piece, CurrCell, 0, SeqBottomRight),
SeqLeftDiag is SeqTopLeft + SeqBottomRight,
maxListElem([SeqHorizontal, SeqRightDiag, SeqLeftDiag, TempBiggestSeq], SeqHorizontal, Biggest),
(Biggest > TempBiggestSeq ->
	NewMove = CurrCell
;
	NewMove = TempMove
),
getBestMove(Board, B, Turn, NewMove, Move, Biggest, BiggestSeq).


checkSeqRight(Board, Piece, [], TempSeq, Seq):- Seq is TempSeq.

/*Returns number of consecutive enemy pieces to the right of a given cell*/
checkSeqRight(Board, Piece, Cell, TempSeq, Seq):-
[Row, Column] = Cell,
NewRow is Row,
NewColumn is Column + 2,
(NewColumn > 18 ->
	TempSeq2 is TempSeq,
	NextCell = []
;
	getPeca(Board, NewRow, NewColumn, NextCellPiece),
	(Piece == NextCellPiece ->
		TempSeq2 is TempSeq + 1,
		NextCell = [NewRow, NewColumn]
	;
		TempSeq2 is TempSeq,
		NextCell = []
	)
),
checkSeqRight(Board, Piece, NextCell, TempSeq2, Seq).



checkSeqLeft(Board, Piece, [], TempSeq, Seq):- Seq is TempSeq.

/*Returns number of consecutive enemy pieces to the left of a given cell*/
checkSeqLeft(Board, Piece, Cell, TempSeq, Seq):-
[Row, Column] = Cell,
NewRow is Row,
NewColumn is Column - 2,
(NewColumn < 0 ->
	TempSeq2 is TempSeq,
	NextCell = []
;
	getPeca(Board, NewRow, NewColumn, NextCellPiece),
	(Piece == NextCellPiece ->
		TempSeq2 is TempSeq + 1,
		NextCell = [NewRow, NewColumn]
	;
		TempSeq2 is TempSeq,
		NextCell = []
	)
),
checkSeqLeft(Board, Piece, NextCell, TempSeq2, Seq).




checkSeqTopRight(Board, Piece, [], TempSeq, Seq):-
Seq is TempSeq.

/*Returns number of consecutive enemy pieces to the upper right diagonal of a given cell*/
checkSeqTopRight(Board, Piece, Cell, TempSeq, Seq):-
[Row, Column] = Cell,
NewRow is Row - 1,
NewColumn is Column + 1,
(NewRow >= 0, NewColumn =< 18 ->
	getPeca(Board, NewRow, NewColumn, NextCellPiece),
	(Piece == NextCellPiece ->
		TempSeq2 is TempSeq + 1,
		NextCell = [NewRow, NewColumn]
	;
		TempSeq2 is TempSeq,
		NextCell = []
	)
;
	TempSeq2 is TempSeq,
	NextCell = []	
),
checkSeqTopRight(Board, Piece, NextCell, TempSeq2, Seq).



checkSeqBottomLeft(Board, Piece, [], TempSeq, Seq):-
Seq is TempSeq.

/*Returns number of consecutive enemy pieces to the bottom left diagonal of a given cell*/
checkSeqBottomLeft(Board, Piece, Cell, TempSeq, Seq):-
[Row, Column] = Cell,
NewRow is Row + 1,
NewColumn is Column - 1,
(NewRow =< 10, NewColumn >= 0 ->
	getPeca(Board, NewRow, NewColumn, NextCellPiece),
	(Piece == NextCellPiece ->
		TempSeq2 is TempSeq + 1,
		NextCell = [NewRow, NewColumn]
	;
		TempSeq2 is TempSeq,
		NextCell = []
	)
;
	TempSeq2 is TempSeq,
	NextCell = []	
),
checkSeqBottomLeft(Board, Piece, NextCell, TempSeq2, Seq).



checkSeqTopLeft(Board, Piece, [], TempSeq, Seq):-
Seq is TempSeq.

/*Returns number of consecutive enemy pieces to the upper left diagonal of a given cell*/
checkSeqTopLeft(Board, Piece, Cell, TempSeq, Seq):-
[Row, Column] = Cell,
NewRow is Row - 1,
NewColumn is Column - 1,
(NewRow >= 0, NewColumn >= 0 ->
	getPeca(Board, NewRow, NewColumn, NextCellPiece),
	(Piece == NextCellPiece ->
		TempSeq2 is TempSeq + 1,
		NextCell = [NewRow, NewColumn]
	;
		TempSeq2 is TempSeq,
		NextCell = []
	)
;
	TempSeq2 is TempSeq,
	NextCell = []	
),
checkSeqTopLeft(Board, Piece, NextCell, TempSeq2, Seq).



checkSeqBottomRight(Board, Piece, [], TempSeq, Seq):-
Seq is TempSeq.

/*Returns number of consecutive enemy pieces to the bottom right diagonal of a given cell*/
checkSeqBottomRight(Board, Piece, Cell, TempSeq, Seq):-
[Row, Column] = Cell,
NewRow is Row + 1,
NewColumn is Column + 1,
(NewRow =< 10, NewColumn =< 18 ->
	getPeca(Board, NewRow, NewColumn, NextCellPiece),
	(Piece == NextCellPiece ->
		TempSeq2 is TempSeq + 1,
		NextCell = [NewRow, NewColumn]
	;
		TempSeq2 is TempSeq,
		NextCell = []
	)
;
	TempSeq2 is TempSeq,
	NextCell = []	
),
checkSeqBottomRight(Board, Piece, NextCell, TempSeq2, Seq).



/*Returns random move from the PlayList*/
getRandomMove(PlayList, Move):-
length(PlayList, Size),
(Size == 1 ->
Index is 1;
random(1, Size, Index)),
getNthElem(PlayList, Index, Move).

/*Returns element of given index from a List*/
getNthElem([A|B], 1, Element):- Element = A.
getNthElem(List, Index, Element):-
TempIndex is Index-1,
[A|B] = List,
getNthElem(B, TempIndex, Element).


/*Applies move and returns the updated board*/
applyMove(BoardIn, Move, BoardOut, Peca):-
[A,B] = Move,
setPeca(BoardIn, A, B, Peca, BoardOut). 




getPeca([A|B], 0, Coluna, Peca):-
getLinha(A, Coluna, Peca).

/*Returns piece in given position*/
getPeca(Tabuleiro, Linha, Coluna, Peca):-
[A|B] = Tabuleiro,
C is Linha - 1,
getPeca(B, C, Coluna, Peca).

getLinha([A|B], 0, Peca):-
Peca = A.

getLinha([A|B], Coluna, Peca):-
D is Coluna - 1,
getLinha(B, D, Peca).


/*Changes Piece in a given position and return updated board*/
setPeca(TabuleiroIn, Linha, Coluna, Peca, TabuleiroOut):-
setPecaAux(TabuleiroIn, Linha, Coluna, Peca, [], TabuleiroOut).

setPecaAux(TabuleiroIn, 0, Coluna, Peca, TabuleiroTemp, TabuleiroOut):-
[A|B] = TabuleiroIn,
setLinha(A, Coluna, Peca, [], NovaLinha),
append(TabuleiroTemp, [NovaLinha], TabuleiroTemp2),
append(TabuleiroTemp2, B, TabuleiroTemp3),
append([], TabuleiroTemp3, TabuleiroOut).

setPecaAux(TabuleiroIn, Linha, Coluna, Peca, TabuleiroTemp, TabuleiroOut):-
[A|B] = TabuleiroIn,
append(TabuleiroTemp, [A],TabuleiroTemp2),
C is Linha - 1,
setPecaAux(B, C, Coluna, Peca, TabuleiroTemp2, TabuleiroOut).

setLinha([A|B], 0, Peca, LinhaTemp, NovaLinha):-
append(LinhaTemp, [Peca], LinhaTemp2),
append(LinhaTemp2, B, NovaLinha).

setLinha([A|B], Coluna, Peca, LinhaTemp, NovaLinha):-
D is Coluna - 1,
append(LinhaTemp,[A],LinhaTemp2),
setLinha(B, D, Peca, LinhaTemp2, NovaLinha).



/*Searches one Line for a win sequence*/
searchLinha(Tabuleiro, Linha, Coluna, Peca, 5, Ret):-
Ret is 1.

searchLinha(Tabuleiro, Linha, 19, Peca, Cont, Ret):-
Ret is 0.

searchLinha(Tabuleiro, Linha, 20, Peca, Cont, Ret):-
Ret is 0.

searchLinha(Tabuleiro, Linha, Coluna, Peca, Cont, Ret):-
getPeca(Tabuleiro, Linha, Coluna, Peca2),
(Peca == Peca2 ->
Cont2 is Cont + 1;
Cont2 is 0),
Coluna2 is Coluna + 2,
searchLinha(Tabuleiro, Linha, Coluna2, Peca, Cont2, Ret).



/*Searches one Right Diagonal for a win sequence*/
searchDiagDireita(Tabuleiro, Linha, Coluna, Peca, 5, Ret):-
Ret is 1.

searchDiagDireita(Tabuleiro, 11, Coluna, Peca, Cont, Ret):-
Ret is 0.

searchDiagDireita(Tabuleiro, Linha, 19, Peca, Cont, Ret):-
Ret is 0.

searchDiagDireita(Tabuleiro, Linha, Coluna, Peca, Cont, Ret):-
getPeca(Tabuleiro, Linha, Coluna, Peca2),
(Peca == Peca2 ->
Cont2 is Cont + 1;
Cont2 is 0),
Coluna2 is Coluna + 1,
Linha2 is Linha + 1,
searchDiagDireita(Tabuleiro, Linha2, Coluna2, Peca, Cont2, Ret).



/*Searches one Left Diagonal for a win sequence*/
searchDiagEsquerda(Tabuleiro, Linha, Coluna, Peca, 5, Ret):-
Ret is 1.

searchDiagEsquerda(Tabuleiro, -1, Coluna, Peca, Cont, Ret):-
Ret is 0.

searchDiagEsquerda(Tabuleiro, Linha, 19, Peca, Cont, Ret):-
Ret is 0.

searchDiagEsquerda(Tabuleiro, Linha, Coluna, Peca, Cont, Ret):-
getPeca(Tabuleiro, Linha, Coluna, Peca2),
(Peca == Peca2 ->
Cont2 is Cont + 1;
Cont2 is 0),
Coluna2 is Coluna + 1,
Linha2 is Linha - 1,
searchDiagEsquerda(Tabuleiro, Linha2, Coluna2, Peca, Cont2, Ret).



/*Searches all Lines for a win sequence*/
searchAllLinhas(Tabuleiro, 11, Temp, Par, Peca, Ret):-
Ret is Temp.

searchAllLinhas(Tabuleiro, Linha, Temp, Par, Peca, Ret):-
searchLinha(Tabuleiro, Linha, Par, Peca, 0, Ret2),
Linha2 is Linha + 1,
(Par == 0 ->
Par2 is 1;
Par2 is 0),
(Ret2 == 1 ->
Temp2 is 1;
Temp2 is Temp),
searchAllLinhas(Tabuleiro, Linha2, Temp2, Par2, Peca, Ret).



/*Searches all Left Diagonals for a win sequence*/
searchAllDiagEsquerda(Tabuleiro, Linha, 19, Peca, Temp, Ret):-
Ret is Temp.


searchAllDiagEsquerda(Tabuleiro, Linha, Coluna, Peca, Temp, Ret):-
searchDiagEsquerda(Tabuleiro, Linha, Coluna, Peca, 0, Ret2),
(Ret2 == 1 ->
Temp2 is 1;
Temp2 is Temp),
(Coluna < 5 ->
Linha2 is Linha + 1;
Linha2 is Linha),
Coluna2 is Coluna + 1,
searchAllDiagEsquerda(Tabuleiro, Linha2, Coluna2, Peca, Temp2, Ret).



/*Searches all Right Diagonals for a win sequence*/
searchAllDiagDireita(Tabuleiro, Linha, 19, Peca, Temp, Ret):-
Ret is Temp.

searchAllDiagDireita(Tabuleiro, Linha, Coluna, Peca, Temp, Ret):-
searchDiagDireita(Tabuleiro, Linha, Coluna, Peca, 0, Ret2),
(Ret2 == 1 ->
Temp2 is 1;
Temp2 is Temp),
(Coluna < 5 ->
Linha2 is Linha - 1;
Linha2 is Linha),
Coluna2 is Coluna + 1,
searchAllDiagDireita(Tabuleiro, Linha2, Coluna2, Peca, Temp2, Ret).



/*Checks if game is still goin, if ended in a win/loss or a tie*/
checkEndOfGame(Tabuleiro, 1, Turno, Temp, Ret):-
turnPiece(Turno, Peca),
searchAllDiagEsquerda(Tabuleiro, 5, 0, Peca, 0, Ret2),
(Ret2 == 1 ->
Temp2 is 1;
Temp2 is Temp),
Fase2 is 2,
checkEndOfGame(Tabuleiro, Fase2, Turno, Temp2, Ret).

checkEndOfGame(Tabuleiro, 2, Turno, Temp, Ret):-
turnPiece(Turno, Peca),
searchAllDiagDireita(Tabuleiro, 5, 0, Peca, 0, Ret2),
(Ret2 == 1 ->
Temp2 is 1;
Temp2 is Temp),
Fase2 is 3,
checkEndOfGame(Tabuleiro, Fase2, Turno, Temp2, Ret).

checkEndOfGame(Tabuleiro, 3, Turno, Temp, Ret):-
(Temp == 1 ->
	Ret is Temp;
	possibleMoves(Tabuleiro, PlayList),
	(PlayList == [] ->
	Ret is 2;
	Ret is Temp)
).

checkEndOfGame(Tabuleiro, Fase, Turno, Temp, Ret):-
turnPiece(Turno, Peca),
searchAllLinhas(Tabuleiro, 0, 0, 1, Peca, Ret2),
(Ret2 == 1 ->
Temp2 is 1;
Temp2 is Temp),
Fase2 is Fase + 1,
checkEndOfGame(Tabuleiro, Fase2, Turno, Temp2, Ret).


/*Checks if a move caused a capture and if so, returns where*/
checkCapture(Board, Move, Turn, ListOut):-
reversePiece(Turn, Peca),
[Line, Column] = Move,
checkRight(Board, Line, Column, Peca, Ret),
append([Ret], [], TempList),
checkLeft(Board, Line, Column, Peca, Ret2),
append([Ret2], TempList, TempList2),
checkDiagLeftUp(Board, Line, Column, Peca, Ret3),
append([Ret3], TempList2, TempList3),
checkDiagLeftDown(Board, Line, Column, Peca, Ret4),
append([Ret4], TempList3, TempList4),
checkDiagRightUp(Board, Line, Column, Peca, Ret5),
append([Ret5], TempList4, TempList5),
checkDiagRightDown(Board, Line, Column, Peca, Ret6),
append([Ret6], TempList5, TempList6),
ListOut = TempList6.


/*Checks if a given position can have a capture to the right*/
checkRight(Board, Line, Column, Peca, Ret):-
(Column > 12 ->
Ret = [];
Column2 is Column + 2,
checkCaptureRight(Board, Line, Column2, Peca, 0, 0, [], ListOut),
Ret = ListOut).


/*Checks if there was a capture to the right of a given position*/
checkCaptureRight(Board, Line, Column, Peca, Acum, 3, TempList, ListOut):-
(Acum == 2 ->
	ListOut = TempList;
	ListOut = []
).

checkCaptureRight(Board, Line, Column, Peca, Acum, 2, TempList, ListOut):-
(Peca == 'B'->
Peca3 = 'P';
Peca3 = 'B'),
getPeca(Board, Line, Column, Peca2),
(Peca3 == Peca2 ->
TempList2 = TempList;
TempList2 = []),
Counter2 is 3,
Column2 is Column + 2,
checkCaptureRight(Board, Line, Column2, Peca, Acum, Counter2, TempList2, ListOut).

checkCaptureRight(Board, Line, Column, Peca, Acum, Counter, TempList, ListOut):-
getPeca(Board, Line, Column, Peca2),
(Peca == Peca2 ->
Acum2 is Acum + 1,
A = [[Line, Column]],
append(TempList, A, TempList2);
TempList2 = [],
Acum2 is Acum),
Counter2 is Counter + 1,
Column2 is Column + 2,
checkCaptureRight(Board, Line, Column2, Peca, Acum2, Counter2, TempList2, ListOut).


/*Checks if a given position can have a capture to the left*/
checkLeft(Board, Line, Column, Peca, Ret):-
(Column < 6 ->
Ret = [];
Column2 is Column - 2,
checkCaptureLeft(Board, Line, Column2, Peca, 0, 0, [], ListOut),
Ret = ListOut).


/*Checks if there was a capture to the left of a given position*/
checkCaptureLeft(Board, Line, Column, Peca, Acum, 3, TempList, ListOut):-
(Acum == 2 ->
	ListOut = TempList;
	ListOut = []
).

checkCaptureLeft(Board, Line, Column, Peca, Acum, 2, TempList, ListOut):-
(Peca == 'B'->
Peca3 = 'P';
Peca3 = 'B'),
getPeca(Board, Line, Column, Peca2),
(Peca3 == Peca2 ->
TempList2 = TempList;
TempList2 = []),
Counter2 is 3,
Column2 is Column - 2,
checkCaptureLeft(Board, Line, Column2, Peca, Acum, Counter2, TempList2, ListOut).

checkCaptureLeft(Board, Line, Column, Peca, Acum, Counter, TempList, ListOut):-
getPeca(Board, Line, Column, Peca2),
(Peca == Peca2 ->
Acum2 is Acum + 1,
A = [[Line, Column]],
append(TempList, A, TempList2);
TempList2 = [],
Acum2 is Acum),
Counter2 is Counter + 1,
Column2 is Column - 2,
checkCaptureLeft(Board, Line, Column2, Peca, Acum2, Counter2, TempList2, ListOut).


/*Checks if a given position can have a capture to the upper left*/
checkDiagLeftUp(Board, Line, Column, Peca, Ret):-
(Column < 3 ->
Ret = [];
(Line < 3 ->
Ret = [];
Column2 is Column - 1,
Line2 is Line - 1,
checkCaptureDiagLeftUp(Board, Line2, Column2, Peca, 0, 0, [], ListOut),
Ret = ListOut)).


/*Checks if there was a capture to the upper left of a given position*/
checkCaptureDiagLeftUp(Board, Line, Column, Peca, Acum, 3, TempList, ListOut):-
(Acum == 2 ->
	ListOut = TempList;
	ListOut = []
).

checkCaptureDiagLeftUp(Board, Line, Column, Peca, Acum, 2, TempList, ListOut):-
(Peca == 'B'->
Peca3 = 'P';
Peca3 = 'B'),
getPeca(Board, Line, Column, Peca2),
(Peca3 == Peca2 ->
TempList2 = TempList;
TempList2 = []),
Counter2 is 3,
Column2 is Column - 1,
Line2 is Line - 1,
checkCaptureDiagLeftUp(Board, Line2, Column2, Peca, Acum, Counter2, TempList2, ListOut).

checkCaptureDiagLeftUp(Board, Line, Column, Peca, Acum, Counter, TempList, ListOut):-
getPeca(Board, Line, Column, Peca2),
(Peca == Peca2 ->
Acum2 is Acum + 1,
A = [[Line, Column]],
append(TempList, A, TempList2);
TempList2 = [],
Acum2 is Acum),
Counter2 is Counter + 1,
Column2 is Column - 1,
Line2 is Line - 1,
checkCaptureDiagLeftUp(Board, Line2, Column2, Peca, Acum2, Counter2, TempList2, ListOut).


/*Checks if a given position can have a capture to the lower left*/
checkDiagLeftDown(Board, Line, Column, Peca, Ret):-
(Column < 3 ->
Ret = [];
(Line > 7 ->
Ret = [];
Column2 is Column - 1,
Line2 is Line + 1,
checkCaptureDiagLeftDown(Board, Line2, Column2, Peca, 0, 0, [], ListOut),
Ret = ListOut)).


/*Checks if there was a capture to the lower left of a given position*/
checkCaptureDiagLeftDown(Board, Line, Column, Peca, Acum, 3, TempList, ListOut):-
(Acum == 2 ->
	ListOut = TempList;
	ListOut = []
).

checkCaptureDiagLeftDown(Board, Line, Column, Peca, Acum, 2, TempList, ListOut):-
(Peca == 'B'->
Peca3 = 'P';
Peca3 = 'B'),
getPeca(Board, Line, Column, Peca2),
(Peca3 == Peca2 ->
TempList2 = TempList;
TempList2 = []),
Counter2 is 3,
Column2 is Column - 1,
Line2 is Line + 1,
checkCaptureDiagLeftDown(Board, Line2, Column2, Peca, Acum, Counter2, TempList2, ListOut).

checkCaptureDiagLeftDown(Board, Line, Column, Peca, Acum, Counter, TempList, ListOut):-
getPeca(Board, Line, Column, Peca2),
(Peca == Peca2 ->
Acum2 is Acum + 1,
A = [[Line, Column]],
append(TempList, A, TempList2);
TempList2 = [],
Acum2 is Acum),
Counter2 is Counter + 1,
Column2 is Column - 1,
Line2 is Line + 1,
checkCaptureDiagLeftDown(Board, Line2, Column2, Peca, Acum2, Counter2, TempList2, ListOut).


/*Checks if a given position can have a capture to the upper right*/
checkDiagRightUp(Board, Line, Column, Peca, Ret):-
(Column > 15 ->
Ret = [];
(Line < 3 ->
Ret = [];
Column2 is Column + 1,
Line2 is Line - 1,
checkCaptureDiagRightUp(Board, Line2, Column2, Peca, 0, 0, [], ListOut),
Ret = ListOut)).


/*Checks if there was a capture to the upper right of a given position*/
checkCaptureDiagRightUp(Board, Line, Column, Peca, Acum, 3, TempList, ListOut):-
(Acum == 2 ->
	ListOut = TempList;
	ListOut = []
).

checkCaptureDiagRightUp(Board, Line, Column, Peca, Acum, 2, TempList, ListOut):-
(Peca == 'B'->
Peca3 = 'P';
Peca3 = 'B'),
getPeca(Board, Line, Column, Peca2),
(Peca3 == Peca2 ->
TempList2 = TempList;
TempList2 = []),
Counter2 is 3,
Column2 is Column + 1,
Line2 is Line - 1,
checkCaptureDiagRightUp(Board, Line2, Column2, Peca, Acum, Counter2, TempList2, ListOut).

checkCaptureDiagRightUp(Board, Line, Column, Peca, Acum, Counter, TempList, ListOut):-
getPeca(Board, Line, Column, Peca2),
(Peca == Peca2 ->
Acum2 is Acum + 1,
A = [[Line, Column]],
append(TempList, A, TempList2);
TempList2 = [],
Acum2 is Acum),
Counter2 is Counter + 1,
Column2 is Column + 1,
Line2 is Line - 1,
checkCaptureDiagRightUp(Board, Line2, Column2, Peca, Acum2, Counter2, TempList2, ListOut).


/*Checks if a given position can have a capture to the lower right*/
checkDiagRightDown(Board, Line, Column, Peca, Ret):-
(Column > 15 ->
Ret = [];
(Line > 7 ->
Ret = [];
Column2 is Column + 1,
Line2 is Line + 1,
checkCaptureDiagRightDown(Board, Line2, Column2, Peca, 0, 0, [], ListOut),
Ret = ListOut)).


/*Checks if there was a capture to the lower right of a given position*/
checkCaptureDiagRightDown(Board, Line, Column, Peca, Acum, 3, TempList, ListOut):-
(Acum == 2 ->
	ListOut = TempList;
	ListOut = []
).

checkCaptureDiagRightDown(Board, Line, Column, Peca, Acum, 2, TempList, ListOut):-
(Peca == 'B'->
Peca3 = 'P';
Peca3 = 'B'),
getPeca(Board, Line, Column, Peca2),
(Peca3 == Peca2 ->
TempList2 = TempList;
TempList2 = []),
Counter2 is 3,
Column2 is Column + 1,
Line2 is Line + 1,
checkCaptureDiagRightDown(Board, Line2, Column2, Peca, Acum, Counter2, TempList2, ListOut).

checkCaptureDiagRightDown(Board, Line, Column, Peca, Acum, Counter, TempList, ListOut):-
getPeca(Board, Line, Column, Peca2),
(Peca == Peca2 ->
Acum2 is Acum + 1,
A = [[Line, Column]],
append(TempList, A, TempList2);
TempList2 = [],
Acum2 is Acum),
Counter2 is Counter + 1,
Column2 is Column + 1,
Line2 is Line + 1,
checkCaptureDiagRightDown(Board, Line2, Column2, Peca, Acum2, Counter2, TempList2, ListOut).


/*Presents capture choices and reads choice from input*/
askCapture(Move, CaptureList):-
[A,B] = CaptureList,
nl,
write('Opcao 1: '), write(A), nl,
write('Opcao 2: '), write(B), nl,
write('Escolha uma das casas a capturar'), nl,
write('Linha: '), read(L),
write('Coluna: '), read(C),
Move = [L, C].


/*Asks for a capture choice until a valid one is entered*/
getCapture(CaptureList, Move):- askCapture(Move, CaptureList), member(Move, CaptureList).
getCapture(CaptureList, Move):- nl, write('Escolha Invalida!'),nl,nl,getCapture(CaptureList, Move).



/*Applies chosen captures and returns updated board*/
applyCaptures(BoardIn, [], Piece, BoardOut):- BoardOut = BoardIn.

applyCaptures(BoardIn, CaptureList, Piece, BoardOut):-
[A|B] =  CaptureList,
(A == [] ->
	applyCaptures(BoardIn, B, Piece, BoardOut)
;
	getCapture(A, Move),
	[Line, Column] = Move,
	switchCase(Piece, CapturePiece),
	setPeca(BoardIn, Line, Column, CapturePiece, TempBoard),
	applyCaptures(TempBoard, B, Piece, BoardOut)
).


/*Choses random capture*/
getRandomCapture(CaptureList, Move):-
random(1, 2, Num),
getNthElem(CaptureList, Num, Move).


/*Applies the randomly chosen captures and returns updated board*/
applyRandomCaptures(BoardIn, [], Piece, BoardOut):- BoardOut = BoardIn.

applyRandomCaptures(BoardIn, CaptureList, Piece, BoardOut):-
[A|B] =  CaptureList,
(A == [] ->
	applyRandomCaptures(BoardIn, B, Piece, BoardOut)
;
	getRandomCapture(A, Move),
	[Line, Column] = Move,
	switchCase(Piece, CapturePiece),
	setPeca(BoardIn, Line, Column, CapturePiece, TempBoard),
	applyRandomCaptures(TempBoard, B, Piece, BoardOut)
).


/*Clears captured flags and turns them into playable cells, returns updated board*/
clearCaptureElem(BoardIn, Line, Column, Piece, BoardOut):-
getPeca(BoardIn, Line, Column, Piece2),
switchCase(Piece, Piece3),
(Piece3 == Piece2 ->
setPeca(BoardIn, Line, Column, 'x', BoardOut2),
BoardOut = BoardOut2;
BoardOut = BoardIn).


clearCaptureLine(BoardIn, Line, 19, Piece, BoardOut):-
BoardOut = BoardIn.

clearCaptureLine(BoardIn, Line, Column, Piece, BoardOut):-
clearCaptureElem(BoardIn, Line, Column, Piece, BoardOut2),
Column2 is Column + 1,
clearCaptureLine(BoardOut2, Line, Column2, Piece, BoardOut).

clearCapture(BoardIn, 11, Piece, BoardOut):-
BoardOut = BoardIn.

clearCapture(BoardIn, Line, Piece, BoardOut):-
clearCaptureLine(BoardIn, Line, 0, Piece, BoardOut2),
Line2 is Line + 1,
clearCapture(BoardOut2, Line2, Piece, BoardOut).


/*  game display  */
%printBoard
printBoard(Board):-
write('   '),
printSingleDigitNumeration(0),
nl,
printMatrix(Board, 0).

printMatrix([A|B], 10):-
write(10),
write('|'),
printList(A),
nl,
nl.

printMatrix([A|B], LineCount):-
write(LineCount),
write(' |'),
printList(A),
nl,
nl,
C is LineCount + 1,
printMatrix(B, C).
	
printList([]).	
printList([A|B]):-
write(A),
write(' |'),
printList(B).

printSingleDigitNumeration(10):-
write(10),
write(' '),
printDoubleDigitNumeration(11).

printSingleDigitNumeration(Num):-
write(Num),
write('  '),
N is Num + 1,
printSingleDigitNumeration(N).

printDoubleDigitNumeration(18):-
write(18),
write(' ').

printDoubleDigitNumeration(Num):-
write(Num),
write(' '),
N is Num + 1,
printDoubleDigitNumeration(N).


/*Returns piece in given position*/
getPeca([A|B], 0, Coluna, Peca):-
getLinha(A, Coluna, Peca).

getPeca(Tabuleiro, Linha, Coluna, Peca):-
[A|B] = Tabuleiro,
C is Linha - 1,
getPeca(B, C, Coluna, Peca).

getLinha([A|B], 0, Peca):-
Peca = A.

getLinha([A|B], Coluna, Peca):-
D is Coluna - 1,
getLinha(B, D, Peca).


/*Changes Piece in a given position and return updated board*/
setPeca(TabuleiroIn, Linha, Coluna, Peca, TabuleiroOut):-
setPecaAux(TabuleiroIn, Linha, Coluna, Peca, [], TabuleiroOut).

setPecaAux(TabuleiroIn, 0, Coluna, Peca, TabuleiroTemp, TabuleiroOut):-
[A|B] = TabuleiroIn,
setLinha(A, Coluna, Peca, [], NovaLinha),
append(TabuleiroTemp, [NovaLinha], TabuleiroTemp2),
append(TabuleiroTemp2, B, TabuleiroTemp3),
append([], TabuleiroTemp3, TabuleiroOut).

setPecaAux(TabuleiroIn, Linha, Coluna, Peca, TabuleiroTemp, TabuleiroOut):-
[A|B] = TabuleiroIn,
append(TabuleiroTemp, [A],TabuleiroTemp2),
C is Linha - 1,
setPecaAux(B, C, Coluna, Peca, TabuleiroTemp2, TabuleiroOut).

setLinha([A|B], 0, Peca, LinhaTemp, NovaLinha):-
append(LinhaTemp, [Peca], LinhaTemp2),
append(LinhaTemp2, B, NovaLinha).

setLinha([A|B], Coluna, Peca, LinhaTemp, NovaLinha):-
D is Coluna - 1,
append(LinhaTemp,[A],LinhaTemp2),
setLinha(B, D, Peca, LinhaTemp2, NovaLinha).