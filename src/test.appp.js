import getWeb3 from "./getWeb3";
import SimpleStorage from "./eth/build/contracts/SimpleStorage.json";
import ipfs from "./ipfs";
import { useEffect, useState } from "react";

function App() {
  const [state, setState] = useState({
    web3: null,
    accounts: null,
    contract: null,
    buffer: null,
    ipfsHash: [],
    hoge: "",
  });

  useEffect(async () => {
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

      setState({ web3, accounts, contract: instance });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  }, []);
  console.log(state.ipfsHash);

  const loadIpfsHash = () => {
    const length = await instance.methods.array_length().call();

    console.log("ipfsHashs", length);
    for (let i = 0; i < length; i++) {
      const ipfsH = await instance.methods.ipfsHashes(i).call();
      console.log(i);
      setState({ ipfsHash: [...state.ipfsHash, ipfsH] });
    }
  };
  const captureFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(file);
    reader.onload(() => {
      setState({ buffer: Buffer(reader.result) });
    });
    console.log(state.buffer);
  };

  const onSubmit = (e) => {
    e.preventDefault();

    // add ipfs
    ipfs.files.add(
      state.buffer,
      (async = (err, result) => {
        if (err) {
          console.log(err);
        }
        await state.contract.methods
          .set(result[0].hash)
          .send({ from: state.accounts[0] });
      })
    );
  };
  if (!state.web3) {
    <h1>Loading...</h1>;
  }
  return (
    <div className="App">
      <h1>Hello</h1>
    </div>
  );
}

export default App;
