import getWeb3 from "./getWeb3";
import SimpleStorage from "./eth/build/contracts/SimpleStorage.json";
import ipfs from "./ipfs";
import { Component, useEffect, useState } from "react";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      buffer: null,
      ipfsHash: [],
      hoge: "",
    };
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = SimpleStorage.networks[networkId];

      const instance = new web3.eth.Contract(
        SimpleStorage.abi,
        deployedNetwork && deployedNetwork.address
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.

      this.setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
    await this.loadIpfsHash();
  };

  loadIpfsHash = async () => {
    const length = await this.state.contract.methods.array_length().call();
    console.log("ipfsHashs", length);
    for (let i = 0; i < length; i++) {
      const ipfsH = await this.state.contract.methods.ipfsHashes(i).call();
      console.log(i);
      this.setState({ ipfsHash: [...this.state.ipfsHash, ipfsH] });
    }
  };
  captureFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    console.log(file);
    const reader = new window.FileReader();

    reader.readAsArrayBuffer(file);
    console.log("reader",reader)
    reader.onloadend = () => {
      this.setState({ buffer: Buffer(reader.result) });
      // console.log(this.state.buffer);
    };
    
  };

  onSubmit = (e) => {
    e.preventDefault();

    // add ipfs
    console.log("buffer",this.state.buffer)
    ipfs.files.add(this.state.buffer, async (err, result) => {
      if (err) {
        console.log("err",err);
      }
      console.log(result)
      await this.state.contract.methods
        .set(result[0].hash)
        .send({ from: this.state.accounts[0] });
        return this.loadIpfsHash();
    });

  };

  render() {
    if (!this.state.web3) {
      <h1>Loading...</h1>;
    }
    console.log("Array",this.state.ipfsHash)
    return (
      <div className="App">

        <h1>Your Image</h1>
        {
          this.state.ipfsHash.map((hash,key)=>(
            <div key={key}>
              <img width="200" height="200" src={`https://ipfs.io/ipfs/${hash}`} alt=""></img>
            </div>
          ))
        }
        <h1>Upload Image</h1>
        <form onSubmit={this.onSubmit}>
          <input type="file" onChange={this.captureFile} />
          <input type="submit" />
        </form>
      </div>
    );
  }
}

export default App;
