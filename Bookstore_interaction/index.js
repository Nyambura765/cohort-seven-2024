import { ethers, Wallet, formatEther, toBigInt } from "ethers";
import * as dotenv from 'dotenv';
dotenv.config();
import bookStore from "./ABI/Bookstore.json" assert { type: 'json' };

// Function to create a contract instance
const createContractInstanceOnEthereum = (contractAddress, contractAbi) => {
    const alchemyApiKey = process.env.ALCHEMY_API_KEY_SEPOLIA;
    const provider = new ethers.AlchemyProvider('sepolia', alchemyApiKey);
    console.log("Provider initialized:", provider);

    const privateKey = process.env.WALLET_PRIVATE_KEY;
    const wallet = new Wallet(privateKey, provider); 
    console.log("Wallet connected:", wallet.address);

    const contract = new ethers.Contract(contractAddress, contractAbi, wallet);
    console.log("Contract instance created:", contract.address);

    return contract;
};

const contractAddress = '0x346311db922eac24426c96c76ae98126eb835cab';
const contractOnETH = createContractInstanceOnEthereum(contractAddress, bookStore.abi);

// Function to add a book to the contract
const addBookToContract = async (bookId, title, author, price, stock) => {
    try {
        console.log("Adding book with details:", { bookId, title, author, price, stock });
        const txResponse = await contractOnETH.addBook(bookId, title, author, price, stock);
        console.log("Transaction submitted. Hash:", txResponse.hash);
        console.log(`View transaction on Etherscan: https://sepolia.etherscan.io/tx/${txResponse.hash}`);
    } catch (error) {
        console.error("Error adding book to contract:", error);
        throw error;
    }
};

const bookDetails = {
    bookId: 8,
    title: "Harry Potter",
    author: "J.K. Rowling",
    price: 10,
    stock: 100
};

// Function to retrieve book details from the contract
const getBook = async (_bookId) => {
    try {
        console.log("Fetching book details for ID:", _bookId);
        const books = await contractOnETH.getBooks(_bookId);
        console.log("Book details retrieved:", books);
    } catch (error) {
        console.error("Error fetching book details:", error);
    }
};

// Function to buy a book from the contract
const buyBookFromContract = async (bookId, quantity) => {
    try {
        console.log(`Buying book with ID: ${bookId}, Quantity: ${quantity}`);
        const book = await contractOnETH.getBooks(bookId);
        console.log("Book details for purchase:", book);

        // Calculate the total price
        const price = ethers.parseEther(book[2]).toString();
        const totalPrice = price * quantity;
        console.log(`Total price calculated: ${totalPrice} wei`);

        // Sending the transaction
        const txResponse = await contractOnETH.buyBook(bookId, quantity, { value: totalPrice });
        console.log("Transaction submitted. Hash:", txResponse.hash);
        console.log(`View transaction on Etherscan: https://sepolia.etherscan.io/tx/${txResponse.hash}`);
    } catch (error) {
        console.error("Error buying book from contract:", error);
    }
};

// Main execution flow
(async () => {
    console.log("Starting contract operations...");

    await addBookToContract(bookDetails.bookId, bookDetails.title, bookDetails.author, bookDetails.price, bookDetails.stock);

    const _bookId = 1;
    await getBook(_bookId);

    await buyBookFromContract(_bookId, 1);

    console.log("Contract operations complete.");
})();
