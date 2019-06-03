import React, { createContext, Component } from 'react';
import _ from 'lodash';

function clone(obj: any) {
  return JSON.parse(JSON.stringify(obj));
}

class Point {
  x: number;
  y: number;
  value: string | null = null;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static key(x: number, y: number): string {
    return `${x}-${y}`
  }
  static keyFromPoint(point: Point): string {
    return this.key(point.x, point.y)
  }
}

interface IndexedPoints {
  [position: string]: Point;
}

class Board {
  points: IndexedPoints = {};
  width: number;
  height: number;
  winCount = 3;
  winner: string | null = null;
  win: any = {}

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    if (this.width > 5 || this.height > 5) {
      this.winCount = 5;
    }
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let point = new Point(x, y);
        this.points[Point.keyFromPoint(point)] = point;

      }
    }
  }
  
  isWinningPoint(x:number, y:number) {
    //console.log(this.win, x, y, this.winCount)
    switch(this.win.type) { 
      case 'line': return y==this.win.start.y && x>=this.win.start.x && x<this.win.start.x+this.winCount;
      case 'column': return x==this.win.start.x && y>=this.win.start.y && y<this.win.start.y+this.winCount; 
      case 'ob': 
        for(let i=0; i<this.winCount; i++) {
          if(x===this.win.start.x+i && y===this.win.start.y+i) {
            return true;
          }
        }
        return false;
      case 'ot':
        for(let i=0; i<this.winCount; i++) {
          if(x===this.win.start.x+i && y===this.win.start.y-i) {
            return true;
          }
        }
        return false;
    }
  }

  value(x: number, y: number) {
    return this.points[Point.key(x, y)].value;
  }

  set(x: number, y: number, value: string) {
    return this.points[Point.key(x, y)].value = value;
  }

  static emptyPoints(board: Board): Point[] {
    const points: Point[] = [];
    for (let [_, point] of Object.entries(board.points)) {
      if (point.value === null) {
        points.push(point);
      }
    }
    if(points.length===board.width*board.height) {      
      return [
        new Point(1,0),
        new Point(0,0),
        new Point(1,1),
      ]
    }
    return points;
  }

  static completed(board: Board): boolean {
    const points: Point[] = [];
    for (let [_, point] of Object.entries(board.points)) {
      if (point.value === null) {
        return false;
      }
    }
    return true;
  }

  protected static line(x: number, y: number, board: Board): boolean {
    const start: string | null = board.points[Point.key(x, y)].value;
    if (start === null) {
      return false;
    }
    if(x>board.width-board.winCount){
      return false;
    }
    for (let i = x + 1; i < x + board.winCount; i++) {
      if (!board.points[Point.key(i, y)] || board.points[Point.key(i, y)].value !== start) {
        return false;
      }
    }
    board.winner = start;
    return true;
  }

  protected static column(x: number, y: number, board: Board): boolean {
    const start = board.points[Point.key(x, y)].value;
    if (start === null) {
      return false;
    }
    if(y>board.height-board.winCount){
      return false;
    }
    for (let j = y + 1; j < y + board.winCount; j++) {
      if (!board.points[Point.key(x, j)] || board.points[Point.key(x, j)].value !== start) {
        return false;
      }
    }
    board.winner = start;
    return true;
  }

  protected static obliqBottom(x: number, y: number, board: Board): boolean {
    const start = board.points[Point.key(x, y)].value;
    if (start === null) {
      return false;
    }
    if(x>board.width-board.winCount){
      return false;
    }
    for (let i = 0; i < board.winCount; i++) {
      if (!board.points[Point.key(x + i, y + i)] || board.points[Point.key(x + i, y + i)].value !== start) {
        return false;
      }
    }
    board.winner = start;
    return true;
  }

  protected static obliqTop(x: number, y: number, board: Board): boolean {
    const start = board.points[Point.key(x, y)].value;
    if (start === null) {
      return false;
    }
    if(x>board.width-board.winCount){
      return false;
    }
    for (let i = 0; i < board.winCount; i++) {
      if (!board.points[Point.key(x + i, y - i)] || board.points[Point.key(x + i, y - i)].value !== start) {
        return false;
      }
    }
    board.winner = start;
    return true;
  }

  static won(board: Board): boolean {
    // Won by line
    for (let y = 0; y < board.height; y++) {
      for (let x = 0; x < board.width; x++) {
        if (Board.line(x, y, board)) {
          board.win = {start: {x, y}, type:'line'};
          return true;
        }
        if (Board.column(x, y, board)) {
          board.win = {start: {x, y}, type:'column'};
          return true;
        }
        if (Board.obliqBottom(x, y, board)) {
          board.win = {start: {x, y}, type:'ob'};
          return true;
        }
        if (Board.obliqTop(x, y, board)) {
          board.win = {start: {x, y}, type:'ot'};
          return true;
        }
      }
    }
    return false;
  }
  static hasAdjacentPoint(point: Point, board: Board, distance:number) {
    for(let x = Math.max(0, point.x - distance); x<Math.min(board.width, point.x + distance); x++) {
      for(let y = Math.max(0, point.y - distance); y<Math.min(board.width, point.y + distance); y++) {
        if(board.points[Point.key(x, y)].value!==null) {
          return true;
        }
      }
    }
    return false;
  }
}

class Node {
  board: Board;
  point: Point;
  protected computedChilds: Node[] | null = null
  constructor(board: Board, point: Point) {
    this.board = board;
    this.point = point;
  }

  get childs(): Node[] {
    if (this.computedChilds) {
      return this.computedChilds;
    }
    const childs: Node[] = [];
    if (Board.won(this.board)) {
      return [];
    }
    for (let emptyPoint of Board.emptyPoints(this.board)) {
      /*if(!Board.hasAdjacentPoint(emptyPoint, this.board, 2)) {
        continue;
      }*/
      let point = clone(emptyPoint);
      point.value = this.point.value === 'X' ? 'O' : 'X';
      const board = clone(this.board);
      board.points[Point.keyFromPoint(point)] = point;
      childs.push(new Node(board, point));
    }
    this.computedChilds = childs;
    return this.computedChilds;
  }

  get isTerminal() {
    return this.childs.length === 0;
  }

  get value(): number {
    //console.log('X win', this.board.won('X'), 'O win', this.board.won('O'));
    const won = this.board.winner !== null;
    return won ? (this.board.winner === 'X' ? -100 : 100) : 0;
  }
}

class Try {
  static computed:any = {};
  board: Board;
  point: Point;
  count: number = 0;
  value: number = -Infinity;
  constructor(board: Board, point: Point) {
    this.board = clone(board);
    this.board.points[Point.keyFromPoint(point)] = point;
    this.point = point;
  }

  compute() {
    const node = new Node(this.board, this.point);
    //this.value = this.minimax(node, 10, false);
    this.value = this.alphabeta(node, 100);
  }

  protected alphabeta(node: Node, depth:number, alpha:number=-Infinity, beta:number=+Infinity) {
    this.count++;
    if (depth === 0 || node.isTerminal) {
      return node.value*depth;
    }
    let value: number;
    if(node.point.value==='O'){
        value = +Infinity;
        node.childs.forEach((child: Node) => {
          value = Math.min(value, this.alphabeta(child, depth - 1, alpha, beta));
          if(alpha>=value) {
            return value;
          }
          beta = Math.min(beta, value);
        })
    } else {
      value = -Infinity;
      node.childs.forEach((child: Node) => {
        value = Math.max(value, this.alphabeta(child, depth - 1, alpha, beta));
        if(value>=beta) {
          return value;
        }
        alpha = Math.max(alpha, value);
      })
    }
    return value;
  }

  protected minimax(node: Node, depth: number, maximizingPlayer: boolean): number {
    this.count++;
    if (depth === 0 || node.isTerminal) {
      return node.value * (depth);
    }
    let value: number;
    if (maximizingPlayer) {
      value = -Infinity;
      node.childs.forEach((child: Node) => {
        value = Math.max(value, this.minimax(child, depth - 1, false))
      })
    } else {
      value = Infinity;
      node.childs.forEach((child: Node) => {
        value = Math.min(value, this.minimax(child, depth - 1, true))
      })
    }
    //console.log(maximizingPlayer, value);
    //console.log(this.count)
    return value;
  }

}

class Round {

  board: Board;
  resultingPoint: Point = new Point(-1, -1);

  constructor(board: Board) {
    this.board = board;
  }

  evaluate() {
    let betterTry: Try | null = null;
    // var try:Try = betterTry;
    for (let emptyPoint of Board.emptyPoints(this.board)) {
      /*if(!Board.hasAdjacentPoint(emptyPoint, this.board, 1)) {
        continue;
      }*/
      let point = clone(emptyPoint);
      point.value = emptyPoint.value === null || emptyPoint.value === 'X' ? 'O' : 'X';
      let current = new Try(this.board, point);
      current.compute();
      if (betterTry === null || current.value > betterTry.value) {
        betterTry = current;
      }
      console.log(point, current.value, current.count);
    }
    console.log(betterTry);

    this.resultingPoint = betterTry !== null ? betterTry.point : new Point(-1, -1);
  }

  get betterPoint(): Point {
    return this.resultingPoint;
  }
}

class Robot {
  protected setState: Function;
  constructor(setState: Function) {
    this.setState = setState;
  }

  play(board: Board) {
    const round = new Round(board);
    round.evaluate();
    const point = round.betterPoint;
    board.points[Point.keyFromPoint(point)] = point;
    const won = Board.won(board);
    const ended = Board.completed(board)
    this.setState({ board, playable: !won&&!ended, won, ended })
  }
}

const AppContext = createContext({
  width: 3,
  height: 3,
  board: new Board(3, 3),
});

interface AppProviderState {
  width: number;
  height: number;
  playable: boolean;
  board: Board;
  won: boolean;
  ended: boolean;
}

export class AppProvider extends Component<any, AppProviderState> {
  state = {
    width: 3,
    height: 3,
    playable: true,
    won: false,
    ended: false,
    board: new Board(3, 3),
    choice: (x: number, y: number) => () => {
      const board = this.state.board;
      board.set(x, y, "X");
      this.setState({ board, playable: false }, () => {
        if (Board.won(board)) {
          this.setState({won: true});
          console.log('won by', board.winner)
        } else if(Board.completed(board)){
          this.setState({ended: true});
        } else {
          console.log('not won')
          this.robot.play(board)
        }
      });
    },
    restart: () => {
      const board = new Board(3, 3);
      this.setState({
        board,
        playable: true,
        won: false,
        ended: false,
      })
    },
    restartWithRobot: () => {
      const board = new Board(3, 3);
      this.setState({
        board,
        playable: true,
        won: false,
        ended: false,
      }, ()=>this.robot.play(board))
    }
  };

  protected robot: Robot;

  constructor(props: any) {
    super(props);
    this.state.board = new Board(this.state.width, this.state.height);
    this.robot = new Robot(this.setState.bind(this))
    // this.state.board.set(1, 2, "X");
    // this.robot.play(this.state.board)
  }
  componentDidMount() {
    // const board = this.state.board;
    // board.set(0, 0, "O");
    // board.set(1, 1, "O");
    // board.set(2, 2, "O");
    // console.log(board.won(), board.winner)
    // this.setState({board})
    // board.set(1, 1, "X");
    // board.set(2, 1, "X");
    // board.set(0, 2, "X");
    // this.setState({board, playable:false}, ()=>this.robot.play(board));
  }

  render() {
    return (
      <AppContext.Provider value={this.state}>
        {this.props.children}
      </AppContext.Provider>
    );
  }
}

export default AppContext