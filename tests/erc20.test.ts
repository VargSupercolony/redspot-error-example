import { artifacts, network, patract } from "redspot";

const { getContractFactory, getRandomSigner } = patract;

const { api, getAddresses } = network;

describe("ERC20", () => {
  after(() => {
    return api.disconnect();
  });

  async function setup() {
    await api.isReady
    const signerAddresses = await getAddresses();
    const Alice = signerAddresses[0];
    const sender = await getRandomSigner(Alice, "10000 UNIT");
    const contractFactory = await getContractFactory("erc20", sender.address);
    const contract = await contractFactory.deploy("new", "1000");
    const abi = artifacts.readArtifact("erc20");
    const receiver = await getRandomSigner();

    return { sender, contractFactory, contract, abi, receiver, Alice };
  }

  it("Can not transfer from empty account", async () => {
    const { contract, Alice, sender } = await setup();

    const emptyAccount = await getRandomSigner(Alice, "10 UNIT");

    const output = await contract.connect(emptyAccount).query.transfer(sender.address, 7)

    console.log(output.output?.toJSON())
  });
});
