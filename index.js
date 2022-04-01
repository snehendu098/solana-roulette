const web3 = require("@solana/web3.js");
const chalk = require("chalk");
const figlet = require("figlet");
const inquirer = require("inquirer");

const {
  userSecretKey,
  treasureSecretKey,
  randomNumber,
  getReturnAmount,
  totalAmtToBePaid,
} = require("./helper");
const { getWalletBalance, airDropSol, transferSOL } = require("./solana");

// estabilishing connection
const connection = new web3.Connection(
  web3.clusterApiUrl("devnet"),
  "confirmed"
);

// Wallets
const userWallet = web3.Keypair.fromSecretKey(Uint8Array.from(userSecretKey));
const treasuryWallet = web3.Keypair.fromSecretKey(
  Uint8Array.from(treasureSecretKey)
);

const init = () => {
  console.log(
    chalk.green(
      figlet.textSync("SOL Stake", {
        font: "Standard",
        horizontalLayout: "default",
        verticalLayout: "default",
      })
    )
  );
  console.log(chalk.yellow`The max bidding amount is 2.5 SOL here`);
};

const askQuestions = () => {
  const questions = [
    {
      name: "SOL",
      type: "number",
      message: "What is the amount of SOL you want to stake?",
    },
    {
      type: "rawlist",
      name: "RATIO",
      message: "What is the ratio of your staking?",
      choices: ["1:1.25", "1:1.5", "1.75", "1:2"],
      filter: function (val) {
        const stakeFactor = val.split(":")[1];
        return stakeFactor;
      },
    },
    {
      type: "number",
      name: "RANDOM",
      message: "Guess a random number from 1 to 5 (both 1, 5 included)",
      when: async (val) => {
        // check total value is gt 5
        if (parseFloat(totalAmtToBePaid(val.SOL)) > 5) {
          console.log(
            chalk.red`You have violated the max stake limit. Stake with smaller amount.`
          );
          return false;
        } else {
          console.log(
            `You need to pay ${chalk.green`${totalAmtToBePaid(
              val.SOL
            )}`} to move forward`
          ); // amount to be paid log

          const userBalance = await getWalletBalance(
            userWallet.publicKey.toString()
          );

          // check if user balance is greater than the total amount to be paid or not
          if (userBalance < totalAmtToBePaid(val.SOL)) {
            console.log(
              chalk.red`You don't have enough balance in your wallet`
            );
            return false;
          } else {
            console.log(
              chalk.green`You will get ${getReturnAmount(
                val.SOL,
                parseFloat(val.RATIO)
              )} if guessing the number correctly`
            );
            return true;
          }
        }
      },
    },
  ];
  return inquirer.prompt(questions);
};

const gameExecution = async () => {
  init();
  const generateRandomNumber = randomNumber(1, 5);
  //   console.log(chalk.green`"Generated number", ${generateRandomNumber}`);

  const answers = await askQuestions();
  //   console.log(answers);
  // proceed if the number is being provided
  if (answers.RANDOM) {
    // transfer from user to treasure
    const paymentSig = await transferSOL(
      userWallet,
      treasuryWallet,
      answers.SOL
    );

    console.log(chalk.greenBright`Payment signature ${paymentSig}`);

    // random matches
    if (generateRandomNumber === answers.RANDOM) {
      // airdrop to treasure after calculating
      await airDropSol(
        treasuryWallet,
        getReturnAmount(answers.SOL, answers.RATIO)
      );

      // transfer
      const tx = await transferSOL(
        treasuryWallet,
        userWallet,
        getReturnAmount(answers.SOL, answers.RATIO)
      );
      console.log(
        chalk.green(figlet.textSync("YOU WON", { font: "3D-ASCII" }))
      );
      console.log(chalk.whiteBright`${tx}`);
    } else {
      console.log(
        chalk.red(
          figlet.textSync("TRY AGAIN", {
            font: "3D-ASCII",
          })
        )
      );
    }
  } else {
    console.log(chalk.bgRed`No number was selected`);
  }
};

// (async function airdrop() {
//   const airdrop = await airDropSol(userWallet, 2);
// })();

gameExecution();
