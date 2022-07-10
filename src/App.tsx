import { Box, Flex, Center, Heading, Button, Stack } from "@chakra-ui/react";
import { RiArrowDownSLine, RiArrowUpSLine } from "react-icons/ri";
import { useState } from "react";

/*
## 需求:
  - 完成比大小遊戲
    - 遊戲流程
      1. 按下 `Start Game` 按鈕會開始遊戲，`Start Game` 按鈕隨即消失
      2. 左邊的卡片中的 `?` 會變成亂數產生的數字 A
      3. 右邊的卡片下方會出現 `Higher` 和 `Lower` 的按鈕，讓 user 擇一點選
      4. 當 user 點選 `Higher` 和 `Lower` 其中一個按鈕後，兩個按鈕隨即消失
      5. 右邊的卡片中的 `?` 會變成亂數產生的數字 B
      6. 比較兩邊的數字大小，然後根據 user 的選擇，顯示遊戲結果在卡片下方，並出現 `Play Again` 按鈕
      7. 當 user 按下 `Play Again` 按鈕後，右邊的卡片中的數字 B 會變回 `?`
      8. 左邊的數字 A 會重新亂數產生，並回到上方第三步，繼續新的一場遊戲
    - 遊戲規則
      - 兩邊的數字都是隨機產生 1~10 之間的數字
      - 當 B > A 時，且 user 選擇 `Higher`，則遊戲結果為 WIN
      - 當 B > A 時，且 user 選擇 `Lower`，則遊戲結果為 LOSE
      - 當 B < A 時，且 user 選擇 `Higher`，則遊戲結果為 LOSE
      - 當 B < A 時，且 user 選擇 `Lower`，則遊戲結果為 WIN
      - 當 B = A 時，且 user 選擇 `Higher`，則遊戲結果為 LOSE
      - 當 B = A 時，且 user 選擇 `Lower`，則遊戲結果為 LOSE
## 加分項目:
  - 重構 components
  - 使用 XState 完成遊戲的狀態切換及邏輯
    - 文件：https://xstate.js.org/docs/

----------------
## Requirements:
  - Complete the High-Low Game
    - Game flow
      1. Start a new game by pressing "Start Game" button, and then hide the button
      2. The "?" in the left card will become a randomly generated number A
      3. Two buttons: "Higher" and "Lower" will show underneath the right card for user to choose upon
      4. After user clicked the “Higher” or “Lower” button, the two buttons will disappear
      5. The "?" in the right card will become a randomly generated number B
      6. Show the game result and “Play Again” button under the cards after comparing the high or low of the two numbers (A & B) and user’s choice
      7. After user clicked the “Play Again” button, the number B in the right card will change back to "?"
      8. Number A in the left card will be regenerated, return to step 3 to continue a new game
    - Game rule
      - The number A and B are always randomly generated between 1~10
      - When B > A and user chose `Higher`，the game result is WIN
      - When B > A and user chose `Lower`，the game result is LOSE
      - When B < A and user chose `Higher`，the game result is LOSE
      - When B < A and user chose `Lower`，the game result is WIN
      - When B = A and user chose `Higher`，the game result is LOSE
      - When B = A and user chose `Lower`，the game result is LOSE

## Bonus:
  - Please refactor the components
  - Complete the game with XState
    - document：https://xstate.js.org/docs/
*/

const App = () => {
  const [aNum, setANum] = useState("?");
  const [bNum, setBNum] = useState("?");
  const [curBNum, setCurBNum] = useState();
  const [gameStatus, setGameStatus] = useState("INIT");
  const [isWin, setIsWin] = useState();

  return (
    <Box bgColor="#f3f3f3" h="100vh">
      <Center pt="120px">
        <Flex w="400px" px="64px" direction="column" align="center">
          <Flex mb="64px">
            <Heading mr="16px" fontSize="36px" color="twitter.500">
              High
            </Heading>
            <Heading fontSize="36px" color="facebook.500">
              Low
            </Heading>
          </Flex>
          <Flex w="full" justify="space-between">
            <Flex maxW="120px" flex={1}>
              <Center
                w="full"
                h="150px"
                px="24px"
                py="16px"
                bgColor="white"
                borderRadius="md"
                boxShadow="lg"
                flex={1}
              >
                <Heading fontSize="54px" color="gray.500">
                  {aNum}
                </Heading>
              </Center>
            </Flex>
            <Flex maxW="120px" flex={1} direction="column">
              <Center
                w="full"
                h="150px"
                px="24px"
                py="16px"
                bgColor="white"
                borderRadius="md"
                boxShadow="lg"
              >
                <Heading fontSize="54px" color="blue.500">
                  {bNum}
                </Heading>
              </Center>

              {/* `Higher` and `Lower` buttons UI */}
              {gameStatus === "GAMING" && (
                <Button
                  mt="32px"
                  colorScheme="twitter"
                  leftIcon={<RiArrowUpSLine />}
                  isFullWidth
                  onClick={() => {
                    console.log("curBNum", curBNum);
                    setBNum(curBNum);
                    setIsWin(getResult(aNum, curBNum, true));
                    setGameStatus("END");
                  }}
                >
                  Higher
                </Button>
              )}
              {gameStatus === "GAMING" && (
                <Button
                  mt="8px"
                  colorScheme="facebook"
                  leftIcon={<RiArrowDownSLine />}
                  isFullWidth
                  onClick={() => {
                    setBNum(curBNum);
                    setIsWin(getResult(aNum, curBNum, false));
                    setGameStatus("END");
                  }}
                >
                  Lower
                </Button>
              )}
            </Flex>
          </Flex>

          {gameStatus === "INIT" && (
            <Box mt="64px">
              <Button
                colorScheme="blue"
                onClick={() => {
                  setANum(getRandomInt());
                  setCurBNum(getRandomInt());
                  setGameStatus("GAMING");
                }}
              >
                Start Game
              </Button>
            </Box>
          )}

          {/* Game result UI */}
          {gameStatus === "END" && (
            <Stack mt="24px" spacing="16px">
              {isWin && (
                <Heading color="twitter.300" align="center">
                  WIN!
                </Heading>
              )}
              {!isWin && (
                <Heading color="red.300" align="center">
                  LOSE!
                </Heading>
              )}

              <Button
                colorScheme="blue"
                onClick={() => {
                  setANum("?");
                  setBNum("?");
                  setGameStatus("INIT");
                }}
              >
                Play Again
              </Button>
            </Stack>
          )}
        </Flex>
      </Center>
    </Box>
  );
};

function getRandomInt() {
  return Math.floor(Math.random() * 10) + 1;
}

function getResult(aNum, bNum, chooseHigh) {
  console.log("getResult", aNum, bNum, chooseHigh);
  if (aNum === bNum) return false;
  if (aNum > bNum) {
    return !chooseHigh;
  } else {
    return chooseHigh;
  }
}

export default App;
