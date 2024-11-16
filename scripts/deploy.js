const hre = require("hardhat");
async function main() {
    await hre.run('compile');
    const Todo = await hre.ethers.getContractFactory("TodoManger");
    const todo = await Todo.deploy();
    await todo.waitForDeployment();
    console.log("Todo Manager Contract Address", await todo.getAddress())
}
main().then(() => process.exit(0))
.catch((error) => { 
    console.error(error);
    process.exit(1);
    });