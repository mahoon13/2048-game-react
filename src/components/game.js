import { useState, useEffect } from "react";
import Board from "./board";

export default function Game() {
  const firstChances = [2, 2, 2, 4];

  const [
    cubes = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ],
    setCubes,
  ] = useState();

  const [score = 0, setScore] = useState();

  const [bestScore = localStorage.getItem("bestScore") || 0, setBestScore] =
    useState();

  function fillRandomCube(cubes) {
    if (!cubes.some((cube) => cube.indexOf(null) != -1)) return;

    let fillNum = firstChances[Math.floor(Math.random() * firstChances.length)];
    let targetCubeNum = Math.floor(Math.random() * 16);
    let targetCube = cubes[Math.floor(targetCubeNum / 4)][targetCubeNum % 4];

    while (targetCube !== null) {
      targetCubeNum = Math.floor(Math.random() * 16);
      targetCube = cubes[Math.floor(targetCubeNum / 4)][targetCubeNum % 4];
    }

    let cubesList = [...cubes];
    cubesList[Math.floor(targetCubeNum / 4)][targetCubeNum % 4] = fillNum;
    setCubes(cubesList);
  }

  useEffect(() => {
    if (!cubes) return;

    fillRandomCube(cubes);
    fillRandomCube(cubes);
  }, []);

  useEffect(() => {
    localStorage.setItem("bestScore", bestScore);
  }, [bestScore]);

  useEffect(() => {
    if (score > bestScore) setBestScore(score);
  }, [score]);

  function moveRight() {
    let newCubes = cubes.map((row) => {
      let newRow = row.filter(Boolean);

      const multiplier = () => {
        for (let x = newRow.length - 1; x > 0; x--) {
          let currentCube = newRow[x];
          let leftCube = newRow[x - 1];

          if (currentCube == leftCube) {
            newRow[x] = currentCube * 2;
            setScore(score + newRow[x]);

            newRow.splice(x - 1, 1);

            multiplier();
            break;
          }
        }
      };

      multiplier();

      while (newRow.length != 4) {
        newRow.unshift(null);
      }
      return newRow;
    });

    return newCubes;
  }

  function moveLeft() {
    let newCubes = cubes.map((row) => {
      let newRow = row.filter(Boolean);

      const multiplier = () => {
        for (let x = 0; x < newRow.length - 1; x++) {
          let currentCube = newRow[x];
          let rightCube = newRow[x + 1];

          if (currentCube == rightCube) {
            newRow[x] = currentCube * 2;
            setScore(score + newRow[x]);

            newRow.splice(x + 1, 1);

            multiplier();
            break;
          }
        }
      };

      multiplier();

      while (newRow.length != 4) {
        newRow.push(null);
      }
      return newRow;
    });

    return newCubes;
  }

  function moveDown() {
    let newLines = [];
    for (let x = 0; x < 4; x++) {
      newLines[x] = [];
      for (let y = 0; y < 4; y++) {
        let cube = cubes[y][x];
        newLines[x].push(cube);
      }
    }

    newLines = newLines.map((newLine) => {
      newLine = newLine.filter(Boolean);

      const multiplier = () => {
        for (let y = newLine.length - 1; y > 0; y--) {
          let currentCube = newLine[y];
          let topCube = newLine[y - 1];

          if (currentCube == topCube) {
            newLine[y] = currentCube * 2;
            setScore(score + newLine[y]);

            newLine.splice(y - 1, 1);

            multiplier();
            break;
          }
        }
      };

      multiplier();

      while (newLine.length != 4) {
        newLine.unshift(null);
      }
      return newLine;
    });

    let newCubes = [];
    for (let x = 0; x < 4; x++) {
      newCubes[x] = [];
      for (let y = 0; y < 4; y++) {
        newCubes[x][y] = newLines[y][x];
      }
    }

    return newCubes;
  }

  function moveUp() {
    let newLines = [];
    for (let x = 0; x < 4; x++) {
      newLines[x] = [];
      for (let y = 0; y < 4; y++) {
        let cube = cubes[y][x];
        newLines[x].push(cube);
      }
    }

    newLines = newLines.map((newLine) => {
      newLine = newLine.filter(Boolean);

      const multiplier = () => {
        for (let y = 0; y < newLine.length - 1; y++) {
          let currentCube = newLine[y];
          let downCube = newLine[y + 1];

          if (currentCube == downCube) {
            newLine[y] = currentCube * 2;
            setScore(score + newLine[y]);

            newLine.splice(y + 1, 1);

            multiplier();
            break;
          }
        }
      };

      multiplier();

      while (newLine.length != 4) {
        newLine.push(null);
      }
      return newLine;
    });

    let newCubes = [];
    for (let x = 0; x < 4; x++) {
      newCubes[x] = [];
      for (let y = 0; y < 4; y++) {
        newCubes[x][y] = newLines[y][x];
      }
    }

    return newCubes;
  }

  //key press handler
  useEffect(() => {
    let moveEvent;

    const keyDownListener = (event) => {
      switch (event.keyCode) {
        //move right
        case 39:
          moveEvent = new Event("moved");
          moveEvent.cubes = moveRight();
          document.dispatchEvent(moveEvent);
          break;

        //move left
        case 37:
          moveEvent = new Event("moved");
          moveEvent.cubes = moveLeft();
          document.dispatchEvent(moveEvent);
          break;

        //move down
        case 40:
          moveEvent = new Event("moved");
          moveEvent.cubes = moveDown();
          document.dispatchEvent(moveEvent);
          break;

        //move up
        case 38:
          moveEvent = new Event("moved");
          moveEvent.cubes = moveUp();
          document.dispatchEvent(moveEvent);
          break;
      }
    };

    document.addEventListener("keydown", keyDownListener);

    return () => {
      document.removeEventListener("keydown", keyDownListener);
    };
  }, [cubes]);

  useEffect(() => {
    const listener = (event) => {
      fillRandomCube(event.cubes);
    };

    if (!checkLoss()) {
      document.addEventListener("moved", listener);
    } else {
      alert("you lose");
      return;
    }

    return () => {
      document.removeEventListener("moved", listener);
    };
  }, [cubes]);

  function checkLoss() {
    if (cubes.some((cube) => cube.indexOf(null) != -1)) return false;

    const stock = (a) => JSON.stringify(a) === JSON.stringify(cubes);

    return (
      stock(moveDown()) &&
      stock(moveLeft()) &&
      stock(moveRight()) &&
      stock(moveUp())
    );
  }

  return <Board bestScore={bestScore} score={score} cubes={cubes} />;
}
