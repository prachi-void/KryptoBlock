import React, { Component } from "react";
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import ipfs from './ipfs';

import "./App.css";
import { thisExpression } from "@babel/types";

const ipfsClient = require('ipfs-http-client')
const Hash = require('ipfs-only-hash')

//const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' })

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            buffer: null,
            ipfsHash: '',
            flag: ''
        };
    }

    state = { ipfsHash: '', storageValue: 0, web3: null, accounts: null, contract: null, buffer: null, account: null, flag: '' };
    captureFile = this.captureFile.bind(this);
    onSubmit = this.onSubmit.bind(this);


    componentDidMount = async() => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
            console.log(accounts)
            const account = accounts[0];
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = SimpleStorageContract.networks[networkId];
            const instance = new web3.eth.Contract(
                SimpleStorageContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // instance.options.address = "[my contract' address on kovan]"


            // Set web3, accounts, and contract to the state, and then proceed with an
            // example of interacting with the contract's methods.
            this.setState({ web3, accounts, contract: instance }, this.runExample, );

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
        this.instantiateContract()
            //this.instantiateContract()
    };

    runExample = async() => {
        const { accounts, contract } = this.state;

        // Stores a given value, 5 by default.
        await contract.methods.set(5).send({ from: accounts[0] });

        // Get the value from the contract to prove it worked.
        const response = await contract.methods.get().call();

        // Update state with the result.
        this.setState({ storageValue: response, });
        this.instantiateContract()
    };



    instantiateContract() {

        const contract = require('truffle-contract')
        const SimpleStorage = contract(SimpleStorageContract)
        SimpleStorage.setProvider(this.state.web3.currentProvider)



        this.state.web3.eth.getAccounts((error, accounts) => {
            SimpleStorage.deployed().then((instance) => {
                this.simpleStorageInstance = instance
                this.setState({ account: accounts[0] })

                return this.simpleStorageInstance.get.call(accounts[0])
            }).then((ipfsHash) => {
                return this.setState({ ipfsHash })
            })
        })
    }

    captureFile(event) {
        console.log('capturing the file');
        event.preventDefault();
        const file = event.target.files[0]
        const reader = new window.FileReader()
        reader.readAsArrayBuffer(file)
        reader.onloadend = () => {
                this.setState({ buffer: Buffer(reader.result) })
                console.log('buffer', this.state.buffer)

            }
            // const hash = (ipfs.add(new Buffer(this.state.buffer), { onlyHash: true }))[0].hash
            //const hash = (ipfs.files.add(new Buffer(blob), { onlyHash: true }))[0].hash



    }

    onSubmit(event) {
        event.preventDefault()
        console.log('submiting file to ipfs');
        //instantiateContract()
        // const hash = (ipfs.add(new Buffer(this.state.buffer), { onlyHash: true }))[0].hash
        //console.log("hash without uploading file", hash)
        var element = document.getElementById("myInput").value
        if (document.getElementById("myInput").value) {
            console.log('verifying file to ipfs');
            const hash = Hash.of(this.state.buffer, { onlyHash: true })

            hash.then(function(value) {
                console.log(value)
                console.log('val', document.getElementById("myInput").value)
                if (value === document.getElementById("myInput").value) {
                    alert('File is verified!')
                    console.log("Matching strings!");
                } else {
                    alert('verification failed:(')
                    console.log("Strings do not match");
                }
            });
            return
        }

        const hash = Hash.of(this.state.buffer, { onlyHash: true })
            //  const data = hash.json()

        //console.log(JSON.parse(data))

        // console.log(JSON.parse(data))
        //console.log(hash["[[PromiseResult]]"])

        hash.then(function(value) {
            console.log(value)
        });

        ipfs.files.add(this.state.buffer, (error, result) => {
            if (error) {
                console.error(error)
                return
            };

            // onlyHash: true only generates the hash and doesn't upload the file


            this.setState({ ipfsHash: result[0].hash })
            this.setState({ path: result[0].path })
            this.setState({ size: result[0].size })
            console.log('information about stored file', result)
            console.log('ipfs', this.state.ipfsHash)
            const myImage = document.querySelector('img')
            myImage.src = `https://ipfs.io/ipfs/${this.state.ipfsHash}`

            // this.simpleStorageInstance.setState(result[0].hash, { from: this.state.account }).then((r) => {


            // return this.setState({ ipfsHash: result[0].hash })




            //})

            // console.log('ipfs', this.state.ipfsHash)


        })
    }



    render() {
        if (!this.state.web3) {
            return <div > Loading Web3, accounts, and contract... < /div>;
        }
        return ( < div className = "App" >

            <
            div class = "navbar" >
            <
            h1 > thekryptoBlock < /h1> < /
            div > <
            div class = "middle" >
            <
            h1 > Image store and verify < /h1>    <
            p > You can see the details of your file once you hit submit < /p>     <
            h2 > Please upload the image below < /h2> <
            img src = { "https://ipfs.io/ipfs/${this.state.ipfsHash}" }
            alt = "" / >

            <
            div class = "space" >
            <
            form onSubmit = { this.onSubmit } >
            <
            input type = 'file'
            onChange = { this.captureFile }
            />  <
            input type = 'submit' / >
            <
            /form> </div >

            <
            div class = "info" >
            <
            p > ipfsHash value is: { this.state.ipfsHash } < /p> <
            p > Account is: { this.state.accounts } < /p> <
            p > path: { this.state.path } < /p> <
            p > size in bits: { this.state.size } < /p>

            <
            /div>


            <
            div class = "bottom" >
            <
            h1 > Verify the file below < /h1>

            <
            form onSubmit = { this.onSubmit } >
            <
            input type = 'file'
            onChange = { this.captureFile }
            /> <label><
            input type = 'text'
            id = "myInput"
            placeholder = "insert key here" /
            >
            <
            /label>  <
            label > <
            input type = 'submit' / >
            <
            /label> < /
            form > < /div >

            <
            div class = 'endBlock' > < /div>

            <
            /div > < /div >
        );
    }
}

export default App;