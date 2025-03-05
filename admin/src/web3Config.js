import Web3 from "web3";
import contractABI from "./Certificate.json";  // Import ABI file

const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));

const contractAddress = "0xa6739E62261D012DAcAe4eF2487182bC98EBA634";  // Replace with actual deployed address
const contract = new web3.eth.Contract(contractABI.abi, contractAddress);

export { web3, contract };
