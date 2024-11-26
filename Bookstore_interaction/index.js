import { ethers, Wallet, formatEther, toBigInt } from "ethers";
import * as dotenv from 'dotenv';
dotenv.config();
import bookStore from "./ABI/Bookstore.json" assert { type: 'json' };


const createContractInstanceOnEthereum = (contractAddress, contractAbi) => {
    const alchemyApiKey = process.env.ALCHEMY_API_KEY_SEPOLIA;
    const provider = new ethers.AlchemyProvider('sepolia', alchemyApiKey);
    console.log("provider==>", provider)

    const privateKey = process.env.WALLET_PRIVATE_KEY;
    const wallet = new Wallet(privateKey, provider); 

    const contract = new ethers.Contract(contractAddress, contractAbi, wallet);
    console.log("contract==>", contract)

    return contract
}

const contractAddress = '0x0F9696E62ce7BF9fDCBa39FD3ad1cAE821E2458a' 
const contractOnETH =  createContractInstanceOnEthereum(contractAddress, bookStore.abi)


const addBookToContract = async(bookId, title, author, price, stock) => {
    try {
        const txResponse = await contractOnETH.addBook(bookId, title, author, price, stock)
        console.log(txResponse.hash)
        console.log(`https://sepolia.etherscan.io/tx/${txResponse.hash}`)
        
    } catch (error) {
        console.error(error) 
        throw error
    }
}


const bookDetails = {
    bookId: 5,
    title: "Harry Potter",
    author: "J.K. Rowling",
    price: 10,
    stock: 100
}


const _bookId = 1
const getBook = async (_bookId) => {
    try{
        const books = await contractOnETH.getBooks(_bookId)

        console.log(books[2])
    } catch (error) {
        console.error(error)
    }
}

const buyBookFromContract = async (bookId, quanity) => {
    try {

        const book = await contractOnETH.getBooks(_bookId)
        // get the total price of the book
        const price = ethers.parseEther(book[2]).toString()
        const totalPrice = price * quanity

        // buying book
        const txResponse = await contractOnETH.buyBook(bookId, quanity, { value: totalPrice})
        console.log(txResponse.hash)
        console.log(`https://sepolia.etherscan.io/tx/${txResponse.hash}`)
        } catch (error) {
            console.error(error)
    }
        
} 



(async () => {
    await addBookToContract(bookDetails.bookId, bookDetails.title, bookDetails.author, bookDetails.price, bookDetails.stock)
    await getBook(_bookId)
    await buyBookFromContract(_bookId, 1)
})()


