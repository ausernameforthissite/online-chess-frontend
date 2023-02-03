import React, { FC, useEffect } from "react"
import { useLocation } from "react-router-dom"

import BoardCell from "../../components/board-cell/BoardCell"
import ChessBoard from "../../components/chess-board/ChessBoard"
import ChessPieceComponent from "../../components/chess-piece/ChessPieceComponent"
import { useAppSelector } from "../../hooks/ReduxHooks"
import { ChessPiece } from "../../models/chess-game/exports"
import { IMatch } from "../../models/chess-game/IMatch"
import MatchService from "../../services/MatchService"



const Match: FC = () => {

  const location = useLocation();
  const match: IMatch | null = useAppSelector(state => state.matchData.match)


  useEffect(() => {
    const url = location.pathname;
    console.log(url.slice(url.lastIndexOf("/")))
    const matchId = Number(url.slice(url.lastIndexOf("/") + 1 ));
    console.log(matchId)
    if (Number.isNaN(matchId) || matchId < 0) {
      console.log("Wrong match id!");
    } else {
      MatchService.getMatchState(matchId);
    }
  }, [])



  
  function selectChessPiece(e: React.MouseEvent<any>, chessPiece: ChessPiece): void {
    e.preventDefault();
    console.log("Piece is selected")
  }


  return (
      <div>
        <h1>Match</h1>
        {match &&
          <ChessBoard playerColor={match.myColor}>
            {match.boardState.map((row, i) => {
              return (
                row.map((cell, j) => {
                  if (cell != null) {

                    if (cell instanceof ChessPiece) {

                      if ((cell as ChessPiece).color === match.myColor) {
                        return <ChessPieceComponent key={String(i) + String(j)} playerColor={match.myColor} chessPiece={cell} pieceCoords={{numberCoord: i, letterCoord: j}} />
                      } else {
                        return <ChessPieceComponent key={String(i) + String(j)} playerColor={match.myColor} chessPiece={cell} pieceCoords={{numberCoord: i, letterCoord: j}} />
                      }
                    } else {
                      return <BoardCell key={String(i) + String(j)} playerColor={match.myColor} pieceCoords={{numberCoord: i, letterCoord: j}} />
                    }
                  }
                }
              ))
            })}
          </ChessBoard>
        }
        
      </div>
  )
}

export default Match