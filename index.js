
const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;
const Fortmatic = window.Fortmatic;

const evmChains = window.evmChains;

// Web3modal instance
let web3Modal

// Chosen wallet provider given by the dialog window
let provider;

let stakingContractAbi = [{"inputs":[{"internalType":"contract IMintableERC20","name":"_reward","type":"address"},{"internalType":"address","name":"_governance","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"governance","type":"address"}],"name":"GovernanceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"pendingGovernance","type":"address"}],"name":"PendingGovernanceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"poolId","type":"uint256"},{"indexed":true,"internalType":"contract IERC20","name":"token","type":"address"}],"name":"PoolCreated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"uint256","name":"poolId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"rewardWeight","type":"uint256"}],"name":"PoolRewardWeightUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"rewardRate","type":"uint256"}],"name":"RewardRateUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"poolId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"poolId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensDeposited","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"user","type":"address"},{"indexed":true,"internalType":"uint256","name":"poolId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"}],"name":"TokensWithdrawn","type":"event"},{"inputs":[],"name":"governance","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingGovernance","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reward","outputs":[{"internalType":"contract IMintableERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"name":"tokenPoolIds","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalTokensClaimed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_pendingGovernance","type":"address"}],"name":"setPendingGovernance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"acceptGovernance","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_rewardRate","type":"uint256"}],"name":"setRewardRate","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"_token","type":"address"}],"name":"createPool","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"_rewardWeights","type":"uint256[]"}],"name":"setRewardWeights","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_poolId","type":"uint256"},{"internalType":"uint256","name":"_depositAmount","type":"uint256"}],"name":"deposit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_poolId","type":"uint256"},{"internalType":"uint256","name":"_withdrawAmount","type":"uint256"}],"name":"withdraw","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_poolId","type":"uint256"}],"name":"claim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_poolId","type":"uint256"}],"name":"exit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"rewardRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalRewardWeight","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"poolCount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_poolId","type":"uint256"}],"name":"getPoolToken","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_poolId","type":"uint256"}],"name":"getPoolTotalDeposited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_poolId","type":"uint256"}],"name":"getPoolRewardWeight","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_poolId","type":"uint256"}],"name":"getPoolRewardRate","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_poolId","type":"uint256"}],"name":"getStakeTotalDeposited","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_account","type":"address"},{"internalType":"uint256","name":"_poolId","type":"uint256"}],"name":"getStakeTotalUnclaimed","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}]

let stakingContract;

let stakingInstance;
let tokenAddress
// Address of the selected account
let selectedAccount;

let web3;

let uniswapContractAbi = [{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Burn","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1","type":"uint256"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"sender","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount0In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1In","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount0Out","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"amount1Out","type":"uint256"},{"indexed":true,"internalType":"address","name":"to","type":"address"}],"name":"Swap","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint112","name":"reserve0","type":"uint112"},{"indexed":false,"internalType":"uint112","name":"reserve1","type":"uint112"}],"name":"Sync","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"MINIMUM_LIQUIDITY","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[],"name":"factory","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token0","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"token1","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getReserves","outputs":[{"internalType":"uint112","name":"reserve0","type":"uint112"},{"internalType":"uint112","name":"reserve1","type":"uint112"},{"internalType":"uint32","name":"blockTimestampLast","type":"uint32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"price0CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"price1CumulativeLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"kLast","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"mint","outputs":[{"internalType":"uint256","name":"liquidity","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"burn","outputs":[{"internalType":"uint256","name":"amount0","type":"uint256"},{"internalType":"uint256","name":"amount1","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount0Out","type":"uint256"},{"internalType":"uint256","name":"amount1Out","type":"uint256"},{"internalType":"address","name":"to","type":"address"},{"internalType":"bytes","name":"data","type":"bytes"}],"name":"swap","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"}],"name":"skim","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"sync","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"}],"name":"initialize","outputs":[],"stateMutability":"nonpayable","type":"function"}]
let uniswapContract;
let uniswapContract2;
var ERC20ABI = [{"inputs":[{"internalType":"address","name":"d","type":"address"},{"internalType":"address","name":"_masterContract","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"_decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"checkAccess","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"contractCreator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"masterContract","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"addy","type":"address"}],"name":"newMaster","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"},{"internalType":"address","name":"_spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"_burn","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"_burnFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"nonpayable","type":"function"}]


var bridgeABI = [{"inputs":[{"internalType":"address","name":"_wxeq","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"admin_transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"_to","type":"address"},{"indexed":true,"internalType":"string","name":"_txid","type":"string"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"from_eon","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"string","name":"_to","type":"string"},{"indexed":false,"internalType":"uint256","name":"_value","type":"uint256"}],"name":"to_eon","type":"event"},{"inputs":[],"name":"contractCreator","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"eth_addresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"from_volume","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"to_volume","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"wXEQContract","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"xeq_amounts","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"string","name":"","type":"string"}],"name":"xeq_complete","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"}],"name":"devFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_value","type":"uint256"},{"internalType":"uint256","name":"devFeeVal1","type":"uint256"}],"name":"devFee","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"pure","type":"function"},{"inputs":[{"internalType":"uint256","name":"val","type":"uint256"}],"name":"setDevFee","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"string","name":"_to","type":"string"}],"name":"request_to_xeq","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"tx_hash","type":"string"}],"name":"claim_from_xeq","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"string","name":"tx_hash","type":"string"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"register","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"tx_hash","type":"string"}],"name":"isSwapRegistered","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_amount","type":"uint256"},{"internalType":"address","name":"_addy","type":"address"}],"name":"adminTransfer","outputs":[],"stateMutability":"nonpayable","type":"function"}]
let erc20Contract;

let interval_balance = null
let interval_daily = null
let interval_pending = null
let symbol = "wXEQ"
let wxeqUSDCAddress = ""
let wxeqETHAddress = ""
let stakingAddress = ""
let bridgeAddress = ""
/**
 * Setup the orchestra
 */
async function init() {
getPooledBalances()
}

async function fetchBlockNumber() {
    let eth_block_num = await web3.eth.getBlockNumber()
    document.querySelector("#eth_block_num").innerHTML = (eth_block_num).toLocaleString()
}

async function fetchGasPrice() {
    let gas_num = await web3.eth.getGasPrice()
    document.querySelector("#gas").innerHTML = (gas_num / 1e9).toFixed(0).toLocaleString()
}

async function fetchStakedAccount(user, pool)
{
    return await stakingContract.methods.getStakeTotalDeposited(user, pool).call();
}

async function fetchTotalStakedAmount(pool)
{
    return await stakingContract.methods.getPoolTotalDeposited(pool).call();
}

async function fetchPending(user, pool)
{
    return await stakingContract.methods.getStakeTotalUnclaimed(user, pool).call();
}

async function fetchBalance(user, token)
{
  console.log(user, token)
    erc20Contract = new web3.eth.Contract(ERC20ABI, token)

    return erc20Contract.methods.balanceOf(user).call()
}

async function checkTransaction(tx_hash){

}

async function getPooledBalances() {

  let _provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/079430f0746145d291bba904431ce803")
  let _web3 = new Web3(_provider)

  let eth_balances
  let usdc_balances
  let xeq_balances

  let token = new _web3.eth.Contract(ERC20ABI, "0x4a5B3D0004454988C50e8dE1bCFC921EE995ADe3")
  let eth_xeqETH_xeq = await token.methods.balanceOf("0x631540a0f8908559f6c09f5bf1510e467f66715d").call()
  let eth_xeqUSDC_xeq = await token.methods.balanceOf("0x71fa26f268c7bc6083f131f39917d01248e66cf6").call()
  xeq_balances = BigInt(eth_xeqETH_xeq) + BigInt(eth_xeqUSDC_xeq)

  token = new _web3.eth.Contract(ERC20ABI, "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2")
  let eth_xeqETH_eth = await token.methods.balanceOf("0x631540a0F8908559F6C09f5Bf1510e467F66715d").call()
  eth_balances = BigInt(eth_xeqETH_eth)

  token = new _web3.eth.Contract(ERC20ABI, "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
  let eth_xeqUSDC_usdc = await token.methods.balanceOf("0x71FA26f268c7bc6083F131F39917D01248E66Cf6").call()
  usdc_balances = BigInt(eth_xeqUSDC_usdc)

  _provider = new Web3.providers.HttpProvider("https://api.avax.network/ext/bc/C/rpc")
  _web3 = new Web3(_provider)

  token = new _web3.eth.Contract(ERC20ABI, "0xe2B99234b102486aD7F9eaDd51e70eFa8f964FDa")
  let avax_xeqUSDC_xeq = await token.methods.balanceOf("0x637Ac79083bb712f7557E3ABdaB80035b9089108").call()
  xeq_balances += BigInt(avax_xeqUSDC_xeq)

  token = new _web3.eth.Contract(ERC20ABI, "0xB97EF9Ef8734C71904D8002F8b6Bc66Dd9c48a6E")
  let avax_xeqUSDC_usdc = await token.methods.balanceOf("0x637Ac79083bb712f7557E3ABdaB80035b9089108").call()
  usdc_balances += avax_xeqUSDC_usdc

  eth_balances = Number(BigInt(eth_balances) / BigInt(10**14)) / 10**4
  usdc_balances = Number(BigInt(usdc_balances) / BigInt(10**12)) / 10**2
  xeq_balances = Number(BigInt(xeq_balances) / BigInt(10**14)) / 10**4

  console.log(eth_balances.toLocaleString() + " eth", usdc_balances.toLocaleString() + " usdc", xeq_balances.toLocaleString() + " xeq")

}

async function updatePending() {

    let pool_id = 0;
    let pool = document.querySelector("#staking_type").innerHTML

    if(pool == "wXEQ-ETH")
    {
        document.querySelector("#pending_claim").innerHTML = (await fetchPending(selectedAccount, 1) / 1e18).toFixed(2).toLocaleString() + " " + symbol;

    } else if (pool == "wXEQ") {

        document.querySelector("#pending_claim").innerHTML = (await fetchPending(selectedAccount, 0) / 1e18).toFixed(2).toLocaleString() + " " + symbol;

    } else if(pool == "wXEQ-USDC")
    {
        document.querySelector("#pending_claim").innerHTML = (await fetchPending(selectedAccount, 2) / 1e18).toFixed(2).toLocaleString() + " " + symbol;
    }
}

async function updateDailyReward() {

    let pool_id = 0;
    let pool = document.querySelector("#staking_type").innerHTML
  console.log(pool)

    if(pool == symbol + "-ETH")
    {
      console.log("test")
        let total_wxeq_eth_deposited = await stakingContract.methods.getPoolTotalDeposited(1).call();

        let user_staked = await fetchStakedAccount(selectedAccount, 1);

        let reward_weight = (await stakingContract.methods.getPoolRewardWeight(0).call()) / 100

        let reward = (await stakingContract.methods.rewardRate().call()) / 1e18

        let daily_reward = ((reward * reward_weight) * 6526)
        let user_share = (user_staked /1e18)/(total_wxeq_eth_deposited/1e18)
        document.querySelector("#daily_returns").innerHTML = (daily_reward * user_share).toLocaleString() + " " + symbol;

    } else if (pool == symbol + "") {
      console.log("test 1")

        let total_wxeq_deposited = await fetchTotalStakedAmount(0)
        let user_staked = await fetchStakedAccount(selectedAccount, 0);
        let reward_weight = (await stakingContract.methods.getPoolRewardWeight(0).call()) / 100

        let reward = (await stakingContract.methods.rewardRate().call()) / 1e18

        let daily_reward = ((reward * reward_weight) * 6526)
        let user_share = (user_staked /1e18)/(total_wxeq_deposited/1e18)
        document.querySelector("#daily_returns").innerHTML = (daily_reward * user_share).toLocaleString() + " " + symbol;

    } else if(pool == symbol + "-USDC")
    {
      console.log("test 2")
        let total_wxeq_usdc_deposited = await fetchTotalStakedAmount(2)
        let reward_weight = (await stakingContract.methods.getPoolRewardWeight(2).call()) / 100

        if (total_wxeq_usdc_deposited == "0")
        {
            total_wxeq_usdc_deposited = 0
        }

        console.log(total_wxeq_usdc_deposited)

        let user_staked = await fetchStakedAccount(selectedAccount, 2);
        if (user_staked == "0")
        {
            user_staked = 0
        }

        let reward = (await stakingContract.methods.rewardRate().call()) / 1e18

        let daily_reward = ((reward * reward_weight) * 6526)
        let user_share = (user_staked /1e18)/(total_wxeq_usdc_deposited/1e18)

        if(total_wxeq_usdc_deposited == 0)
        {
            user_share = 0
        }

        document.querySelector("#daily_returns").innerHTML = (daily_reward * user_share).toLocaleString() + " " + symbol;
    }
}

async function updateBalance()
{
    let pool_id = 0;
    let pool = document.querySelector("#staking_type").innerHTML

    if(pool == "wXEQ-ETH")
    {
        document.querySelector("#user_balance").innerHTML = (await fetchBalance(selectedAccount, wxeqETHAddress) / 1e18).toLocaleString() + " " + symbol + "-ETH";

    } else if (pool == "wXEQ") {

        document.querySelector("#user_balance").innerHTML = (await fetchBalance(selectedAccount, tokenAddress) / 1e18).toLocaleString() + " " + symbol;


    } else if(pool == "wXEQ-USDC")
    {
        document.querySelector("#user_balance").innerHTML = (await fetchBalance(selectedAccount, wxeqUSDCAddress) / 1e18).toLocaleString(undefined,
            {'minimumFractionDigits':2,'maximumFractionDigits':8}) + " " + symbol + "-USDC";    }
}

async function fetchApprovedCoins(user) {

    return await erc20Contract.methods.allowance(user, tokenAddress).call()
}

/**
 * Kick in the UI action after Web3modal dialog has chosen a provider
 */
async function fetchAccountData() {

  // Get a Web3 instance for the wallet
  // web3 = new Web3(provider);
  //
  // console.log("Web3 instance is", web3);
  //
  // // Get connected chain id from Ethereum node
  // const chainId = await web3.eth.getChainId();
  // // Load chain information over an HTTP API
  // const chainData = evmChains.getChain(chainId);
  //
  // // Get list of accounts of the connected wallet
  // const accounts = await web3.eth.getAccounts();
  //
  // // MetaMask does not give you all accounts, only the selected account
  // selectedAccount = accounts[0];

  // Display fully loaded UI for wallet data
  $("#prepare").hide()
  $("#connected").show();
  // document.querySelector("#network-name").innerHTML = chainData.name;
  document.querySelector("#account").innerHTML =selectedAccount

  let total_wxeq_deposited = await fetchTotalStakedAmount(0)
  let user_staked = await fetchStakedAccount(selectedAccount, 0);
  document.querySelector("#user_staked").innerHTML = (user_staked/1e18).toLocaleString() + " " + symbol;
  let reward = ((0.4840336 * .3) * 6526)
  let user_share = (user_staked /1e18)/(total_wxeq_deposited/1e18)
  document.querySelector("#daily_returns").innerHTML = ((reward * user_share) || 0).toLocaleString() + " " + symbol;
  document.querySelector("#pending_claim").innerHTML = (await fetchPending(selectedAccount, 0) / 1e18).toLocaleString() + " " + symbol;
  document.querySelector("#approved_for_staking").innerHTML = (await fetchApprovedCoins(selectedAccount) / 1e18).toLocaleString() + " " + symbol;
  document.querySelector("#user_balance").innerHTML = (await fetchBalance(selectedAccount, tokenAddress) / 1e18).toLocaleString() + " " + symbol

  var connected = document.querySelectorAll(".connected");

    [].forEach.call(connected, function(el){
        el.classList.remove('disabled')
    })
}



/**
 * Fetch account data for UI when
 * - User switches accounts in wallet
 * - User switches networks in wallet
 * - User connects wallet initially
 */
async function refreshAccountData() {

  // If any current data is displayed when
  // the user is switching acounts in the wallet
  // immediate hide this data
  $("#connected").hide()
  $("#prepare").show()

  // Disable button while UI is loading.
  // fetchAccountData() will take a while as it communicates
  // with Ethereum node via JSON-RPC and loads chain data
  // over an API call.
  document.querySelector("#btn-connect").setAttribute("disabled", "disabled")
  await fetchAccountData(provider);
  document.querySelector("#btn-connect").removeAttribute("disabled")
}


/**
 * Connect wallet button pressed.
 */
async function onConnect() {

  console.log("Opening a dialog", web3Modal);
  console.log("Initializing example");
  console.log("WalletConnectProvider is", WalletConnectProvider);
  console.log("window.web3 is", window.web3, "window.ethereum is", window.ethereum);

  // Tell Web3modal what providers we have available.
  // Built-in web browser provider (only one can exist as a time)
  // like MetaMask, Brave or Opera is added automatically by Web3modal
  const providerOptions = {
    walletconnect: {
      package: WalletConnectProvider, // required
      options: {
        infuraId: "079430f0746145d291bba904431ce803" // required
      }
    }
  };

  web3Modal = new Web3Modal({
    cacheProvider: false, // optional
    providerOptions, // required
  });

  if (!provider)
  provider = await web3Modal.connect();

  web3 = new Web3(provider)
  const chainId = await web3.eth.getChainId();
  const accounts = await web3.eth.getAccounts();
  selectedAccount = accounts[0];
  if (chainId == 1) {
    const chainData = evmChains.getChain(chainId);
    symbol = "wXEQ"
    document.querySelector("#network-name").innerHTML = chainData.name;
    uniswapContract = new web3.eth.Contract(uniswapContractAbi, "0x631540a0f8908559f6c09f5bf1510e467f66715d")
    uniswapContract2 = new web3.eth.Contract(uniswapContractAbi, "0x71fa26f268c7bc6083f131f39917d01248e66cf6")
    erc20Contract = new web3.eth.Contract(ERC20ABI, "0x4a5B3D0004454988C50e8dE1bCFC921EE995ADe3")
    tokenAddress = "0x4a5B3D0004454988C50e8dE1bCFC921EE995ADe3"
    wxeqETHAddress = "0x631540a0f8908559f6c09f5bf1510e467f66715d"
    wxeqUSDCAddress = "0x71fa26f268c7bc6083f131f39917d01248e66cf6"
    stakingAddress = "0x6550E728afaf5414952490E95B9586C5e8eB5b8c"
    bridgeAddress = "0x0bC3F57c2FaF674561641e983aB1Ce7F928BDA7C"
    stakingContract = new web3.eth.Contract(stakingContractAbi, "0x6550E728afaf5414952490E95B9586C5e8eB5b8c")
    document.getElementById("wXEQETHStaking").style.display = "block"
    document.getElementById("wXEQStaking").innerText = "wXEQ"
    document.getElementById("wXEQUSDCStaking").innerText = "wXEQ-USDC"
    document.getElementById("deposit_amount_name").innerText = "wXEQ Amount"
    // document.getElementById("btn-primary").style.backgroundColor = "#0b5ed7"


  } else {
    symbol = "aXEQ"
    document.querySelector("#network-name").innerHTML = "Avalanche";
    uniswapContract = new web3.eth.Contract(uniswapContractAbi, "0x637ac79083bb712f7557e3abdab80035b9089108")
    uniswapContract2 = new web3.eth.Contract(uniswapContractAbi, "0x637ac79083bb712f7557e3abdab80035b9089108")
    erc20Contract = new web3.eth.Contract(ERC20ABI, "0xe2B99234b102486aD7F9eaDd51e70eFa8f964FDa")
    tokenAddress = "0xe2B99234b102486aD7F9eaDd51e70eFa8f964FDa"
    wxeqETHAddress = "0x637ac79083bb712f7557e3abdab80035b9089108"
    wxeqUSDCAddress = "0x637ac79083bb712f7557e3abdab80035b9089108"
    stakingAddress = "0x0f1ab924fbad4525578011b102604d3e2f11f9ef"
    bridgeAddress = "0xf0988ddF64144e450Be37F908fA995C386dD0B30 "
    stakingContract = new web3.eth.Contract(stakingContractAbi, "0x0f1ab924fbad4525578011b102604d3e2f11f9ef")
    document.getElementById("wXEQETHStaking").style.display = "none"
    document.getElementById("wXEQStaking").innerText = "aXEQ"
    document.getElementById("deposit_amount_name").innerText = "aXEQ Amount"
    // document.getElementById("btn-primary").style.add = "#E41F20"


  }


  let total_wxeq_deposited = await stakingContract.methods.getPoolTotalDeposited(0).call();
  document.getElementById("swap_panel").style.display = "none"

  $("check_swap_card").hide();
  document.querySelector("#total_staked").innerHTML = (total_wxeq_deposited / 1e18).toLocaleString() + " " + symbol;

  let reward_weight = (await stakingContract.methods.getPoolRewardWeight(0).call()) / 100

  let reward = (await stakingContract.methods.rewardRate().call()) / 1e18
  console.log((((reward * reward_weight) * 6526 * 365) / (total_wxeq_deposited / 1e18) * 100) || 0)
  document.querySelector("#apy").innerHTML = (((reward * reward_weight) * 6526 * 365) / (total_wxeq_deposited / 1e18) * 100).toLocaleString() + "%";

  fetchBlockNumber()
  fetchGasPrice()
  setInterval(fetchBlockNumber, 10000)
  setInterval(fetchGasPrice, 10000)



  // Subscribe to accounts change
  provider.on("accountsChanged", (accounts) => {
    fetchAccountData();
  });

  // Subscribe to chainId change
  provider.on("chainChanged", (chainId) => {
    onConnect()
    fetchAccountData();
  });

  // Subscribe to networkId change
  provider.on("networkChanged", (networkId) => {
    fetchAccountData();
  });

  document.querySelector("#deposit").addEventListener("click", onDeposit);
  document.querySelector("#claim").addEventListener("click", onClaim);
  document.querySelector("#withdraw").addEventListener("click", onWithdraw);


  $("#swaps").removeAttr("disabled");
  $("#new_approve_button").hide()
  $("#final_new_deposit_button").hide()
$("#deposit_withdraw_back").hide()

  $("#user_panel").show()
  interval_pending = setInterval(updatePending, 5000)
  interval_daily = setInterval(updateDailyReward, 5000)
  interval_balance = setInterval(updateBalance, 5000)

  await refreshAccountData();
}

/**
 * Disconnect wallet button pressed.
 */
async function onDisconnect() {

  console.log("Killing the wallet connection", provider);
  $("#prepare").show();
  $("#connected").hide()
  $("#user_panel").hide()
  $("#swap_panel").hide()

  clearInterval(interval_balance)
  clearInterval(interval_daily)
  clearInterval(interval_pending)
  $("#swaps").prop('disabled', true);

  // TODO: Which providers have close method?
  if(provider.close) {
    await provider.close();

    // If the cached provider is not cleared,
    // WalletConnect will default to the existing session
    // and does not allow to re-scan the QR code with a new wallet.
    // Depending on your use case you may want or want not his behavir.
    await web3Modal.clearCachedProvider();
    provider = new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/079430f0746145d291bba904431ce803")
}

  selectedAccount = null;

  // Set the UI back to the initial state

}

async function onWXEQ()
{
    if(selectedAccount != null)
    {
        $("#user_panel").show()
        $("#swap_panel").hide()
    }
        document.querySelector("#wXEQStaking").classList.add('active')
        document.querySelector("#wXEQETHStaking").classList.remove('active')
        document.querySelector("#wXEQUSDCStaking").classList.remove('active')
        document.querySelector("#swaps").classList.remove('active')
        document.querySelector("#staking_type").innerHTML = symbol;

        let total_wxeq_deposited = await stakingContract.methods.getPoolTotalDeposited(0).call();

        let reward_weight = (await stakingContract.methods.getPoolRewardWeight(0).call()) / 100

        let reward = (await stakingContract.methods.rewardRate().call()) / 1e18

        document.querySelector("#total_staked").innerHTML = (total_wxeq_deposited / 1e18).toLocaleString() + " " + symbol;
        document.querySelector("#apy").innerHTML = (((reward * reward_weight) * 6526 * 365) / (total_wxeq_deposited / 1e18) * 100).toLocaleString() + "%";

        let user_staked = await fetchStakedAccount(selectedAccount, 0);
        console.log(total_wxeq_deposited)
        document.querySelector("#user_staked").innerHTML = (user_staked/1e18).toLocaleString() + "   + symbol(" + ((user_staked / total_wxeq_deposited).toFixed(2).toLocaleString() * 100)+ "%)";
        document.querySelector("#daily_returns").innerHTML = (((reward * reward_weight) * 6526) * ((user_staked /1e18)/(total_wxeq_deposited/1e18))).toLocaleString() + " " + symbol;
        document.querySelector("#pending_claim").innerHTML = (await fetchPending(selectedAccount, 0) / 1e18).toLocaleString() + " " + symbol;
        document.querySelector("#approved_for_staking").innerHTML = (await fetchApprovedCoins(selectedAccount) / 1e18).toLocaleString() + " " + symbol;
        document.querySelector("#user_balance").innerHTML = (await fetchBalance(selectedAccount, tokenAddress) / 1e18).toLocaleString() + " " + symbol;



}

async function onWXEQUSDC()
{
    if(selectedAccount != null)
    {
        $("#user_panel").show()
        $("#swap_panel").hide()
    }
        document.querySelector("#wXEQStaking").classList.remove('active')
        document.querySelector("#wXEQETHStaking").classList.remove('active')
        document.querySelector("#wXEQUSDCStaking").classList.add('active')
        document.querySelector("#swaps").classList.remove('active')
        document.querySelector("#staking_type").innerHTML = "" + symbol+"-USDC";

        let uniswap_wxeq_usdc = await uniswapContract2.methods.getReserves().call()

        let total_wxeq_usdc_deposited = await stakingContract.methods.getPoolTotalDeposited(2).call();

        let reward_weight = (await stakingContract.methods.getPoolRewardWeight(2).call()) / 100

        let reward = (await stakingContract.methods.rewardRate().call()) / 1e18

        document.querySelector("#total_staked").innerHTML = (total_wxeq_usdc_deposited / 1e18).toLocaleString(undefined,
            {'minimumFractionDigits':2,'maximumFractionDigits':8}) + " "+symbol+"-USDC";

        console.log(uniswap_wxeq_usdc)

        document.querySelector("#apy").innerHTML = (((reward * reward_weight) * 6526 * 365) / (uniswap_wxeq_usdc.reserve0 / 1e18) * 100).toLocaleString() + "%";

        let user_staked = await fetchStakedAccount(selectedAccount, 2);
        document.querySelector("#user_staked").innerHTML = (user_staked/1e18).toLocaleString(undefined,
            {'minimumFractionDigits':2,'maximumFractionDigits':8}) + " "+symbol+"-USDC (" + ((user_staked / total_wxeq_usdc_deposited).toFixed(2).toLocaleString() * 100)+ "%)";

        document.querySelector("#daily_returns").innerHTML = (((reward * reward_weight) * 6526) * ((user_staked /1e18)/(total_wxeq_usdc_deposited/1e18))).toLocaleString() + " " + symbol;;
        document.querySelector("#pending_claim").innerHTML = (await fetchPending(selectedAccount, 2) / 1e18).toLocaleString() + " " + symbol;
        erc20Contract = new web3.eth.Contract(ERC20ABI, wxeqUSDCAddress)
        document.querySelector("#approved_for_staking").innerHTML = (await fetchApprovedCoins(selectedAccount) / 1e18).toLocaleString() + " "+symbol+"-USDC";
        document.querySelector("#user_balance").innerHTML = (await fetchBalance(selectedAccount, wxeqUSDCAddress) / 1e18).toLocaleString(undefined,
            {'minimumFractionDigits':2,'maximumFractionDigits':8}) + " "+symbol+"-USDC"


}

async function onWXEQETH()
{
    if(selectedAccount != null)
    {
        $("#user_panel").show()
        $("#swap_panel").hide()
    }
    document.querySelector("#wXEQStaking").classList.remove('active')
    document.querySelector("#wXEQUSDCStaking").classList.remove('active')
    document.querySelector("#wXEQETHStaking").classList.add('active')
    document.querySelector("#swaps").classList.remove('active')
    let total_wxeq_eth_deposited = await stakingContract.methods.getPoolTotalDeposited(1).call();

    let uniswap_wxeq_reserve = await uniswapContract.methods.getReserves().call()

    let reward_weight = (await stakingContract.methods.getPoolRewardWeight(1).call()) / 100

    let reward = (await stakingContract.methods.rewardRate().call()) / 1e18

    document.querySelector("#total_staked").innerHTML = (total_wxeq_eth_deposited / 1e18).toLocaleString() + " "+symbol+"-ETH";

    document.querySelector("#apy").innerHTML = (((reward * reward_weight) * 6526 * 365) / (uniswap_wxeq_reserve.reserve0 / 1e18) * 100).toLocaleString() + "%";

    document.querySelector("#staking_type").innerHTML = ""+symbol+"-ETH";

    let user_staked = await fetchStakedAccount(selectedAccount, 1);
    document.querySelector("#user_staked").innerHTML = (user_staked/1e18).toLocaleString() + " "+symbol+"-ETH  (" + ((user_staked / total_wxeq_usdc_deposited).toFixed(2).toLocaleString() * 100)+ "%)";
    document.querySelector("#daily_returns").innerHTML = (((reward * reward_weight) * 6526) * ((user_staked /1e18)/(total_wxeq_eth_deposited/1e18))).toLocaleString() + " " + symbol;
    document.querySelector("#pending_claim").innerHTML = (await fetchPending(selectedAccount, 1) / 1e18).toLocaleString() + " " + symbol;
    erc20Contract = new web3.eth.Contract(ERC20ABI, wxeqETHAddress)
    document.querySelector("#approved_for_staking").innerHTML = (await fetchApprovedCoins(selectedAccount) / 1e18).toLocaleString() + " "+symbol+"-ETH";
    document.querySelector("#user_balance").innerHTML = (await fetchBalance(selectedAccount, wxeqETHAddress) / 1e18).toLocaleString() + " "+symbol+"-ETH";
}

async function onDeposit() {
    let pool_id = 0;
    let pool = document.querySelector("#staking_type").innerHTML

    if(pool == symbol+"-ETH")
    {
        pool_id = 1
    } else if (pool == symbol+"") {
        pool_id = 0
    } else if(pool == symbol+"-USDC")
    {
        pool_id = 2
    }

    stakingContract = new web3.eth.Contract(stakingContractAbi, stakingAddress)

    let amountString = document.querySelector("#amount_deposit").value
    let amount = web3.utils.toWei(amountString, 'ether')

    let staking_tx = await stakingContract.methods.deposit(pool_id, amount).send({from:selectedAccount});

    if (pool_id == 0)
    {
        document.querySelector("#user_staked").innerHTML = (await fetchStakedAccount(selectedAccount, 0) / 1e18).toLocaleString() + " " + symbol;
    }

    if (pool_id == 1)
    {
        document.querySelector("#user_staked").innerHTML = (await fetchStakedAccount(selectedAccount, 1) / 1e18).toLocaleString() + " "+symbol+"-ETH";
    }

    if (pool_id == 2)
    {
        document.querySelector("#user_staked").innerHTML = (await fetchStakedAccount(selectedAccount, 2) / 1e18).toLocaleString(undefined,
            {'minimumFractionDigits':2,'maximumFractionDigits':8}) + " "+symbol+"-USDC";
    }

}

async function onClaim() {
    let pool_id = 0;
    let pool = document.querySelector("#staking_type").innerHTML

    if(pool == symbol+"-ETH")
    {
        pool_id = 1
    } else if (pool == symbol+"") {
        pool_id = 0
    } else if(pool == symbol+"-USDC")
    {
        pool_id = 2
    }

    stakingContract = new web3.eth.Contract(stakingContractAbi, stakingAddress)

    let staking_tx = await stakingContract.methods.claim(pool_id).send({from:selectedAccount});

    if (pool_id == 0)
    {
        document.querySelector("#pending_claim").innerHTML = (await fetchPending(selectedAccount, 0) / 1e18).toLocaleString() + " " + symbol;
    }

    if (pool_id == 1)
    {
        document.querySelector("#pending_claim").innerHTML = (await fetchPending(selectedAccount, 1) / 1e18).toLocaleString() + " " + symbol;
    }

    if (pool_id == 2)
    {
        document.querySelector("#pending_claim").innerHTML = (await fetchPending(selectedAccount, 2) / 1e18).toLocaleString() + " " + symbol;
    }
}

async function onWithdraw() {

    let pool_id = 0;
    let pool = document.querySelector("#staking_type").innerHTML

    if(pool == symbol + "-ETH")
    {
        pool_id = 1
    } else if (pool == symbol + "") {
        pool_id = 0
    } else if(pool == symbol + "-USDC")
    {
        pool_id = 2
    }

    stakingContract = new web3.eth.Contract(stakingContractAbi, stakingAddress)

    let amountString = document.querySelector("#amount_withdraw").value
    let amount = web3.utils.toWei(amountString, 'ether')

    let staking_tx = await stakingContract.methods.withdraw(pool_id, amount).send({from:selectedAccount});

    if (pool_id == 0)
    {
        document.querySelector("#user_staked").innerHTML = (await fetchStakedAccount(selectedAccount, 0) / 1e18).toLocaleString() + " " + symbol;
    }

    if (pool_id == 1)
    {
        document.querySelector("#user_staked").innerHTML = (await fetchStakedAccount(selectedAccount, 1) / 1e18).toLocaleString() + " "+symbol+"-ETH";
    }

    if (pool_id == 2)
    {
        document.querySelector("#user_staked").innerHTML = (await fetchStakedAccount(selectedAccount, 2) / 1e18).toLocaleString() + " "+symbol+"-USDC";
    }

}

$("#approve").click(async function () {
    let pool_id = 0;
    let pool = document.querySelector("#staking_type").innerHTML

    if(pool == symbol + "-ETH")
    {
        pool_id = 1
        erc20Contract = new web3.eth.Contract(ERC20ABI, wxeqETHAddress)
    } else if (pool == symbol + "") {
        pool_id = 0
        erc20Contract = new web3.eth.Contract(ERC20ABI, tokenAddress)
    } else if(pool == symbol + "-USDC")
    {
        erc20Contract = new web3.eth.Contract(ERC20ABI, wxeqUSDCAddress)
        pool_id = 2
    }

    let amountString = document.querySelector("#amount_deposit").value
    let amount = web3.utils.toWei(amountString, 'ether')

    console.log(amount)

    let staking_tx = await erc20Contract.methods.approve(stakingAddress, amount).send({from:selectedAccount})

    if (pool_id == 0)
    {
        document.querySelector("#approved_for_staking").innerHTML = (await fetchApprovedCoins(selectedAccount) / 1e18).toLocaleString() + " " + symbol;
        $("#deposit").show();
    } else if (pool_id == 1)
    {
        document.querySelector("#approved_for_staking").innerHTML = (await fetchApprovedCoins(selectedAccount) / 1e18).toLocaleString() + " "+symbol+"-ETH";
        $("#deposit").show();
    }

    if (pool_id == 2)
    {
        document.querySelector("#approved_for_staking").innerHTML = (await fetchApprovedCoins(selectedAccount) / 1e18).toLocaleString() + " "+symbol+"-USDC";
        $("#deposit").show();
    }
})

async function onDepositModal() {
    $("#modal_deposit").show()
    $("#deposit").hide()
    let pool = $("#staking_type").innerHTML

    if(pool == "wXEQ-ETH")
    {
        pool_id = 1
        erc20Contract = new web3.eth.Contract(ERC20ABI, wxeqETHAddress)
    } else if (pool == "wXEQ") {
        pool_id = 0
        erc20Contract = new web3.eth.Contract(ERC20ABI, tokenAddress)
    } else if(pool == "wXEQ-USDC")
    {
        erc20Contract = new web3.eth.Contract(ERC20ABI, wxeqUSDCAddress)
        pool_id = 2
    }

    if  ((await fetchApprovedCoins(selectedAccount) / 1e18) > 0)
    {
        console.log("Have coins approved!")
        $("#approve").hide();
        $("#deposit").show();
    } else {
        $("#deposit").hide();
    }

}

$( "#modal_deposit_close" ).click(function() {
    $("#modal_deposit").hide()
});

$( "#withdraw_modal_button").click(function() {
    $("#modal_withdraw").show()
});

$( "#modal_withdraw_close" ).click(function() {
    $("#modal_withdraw").hide()
});


$( "#swaps" ).click(function() {
    console.log(selectedAccount)
    $("#claim_wxeq_swap").hide()
    $("#check_swap_card").hide();
    $("#finish_swap").hide();
    $("#swap_approve").hide();
    $("#check_swap_status").hide()

    if(selectedAccount != null)
    {
        $("#user_panel").hide()
        $("#swap_panel").show()
    }
    $("#warning_text").hide()
    document.querySelector("#wXEQStaking").classList.remove('active')
    document.querySelector("#wXEQUSDCStaking").classList.remove('active')
    document.querySelector("#wXEQETHStaking").classList.remove('active')
    document.querySelector("#swaps").classList.add('active')

});

$("#check_status").click(async function(){

    $("#warning_text").hide()

    let bridge_contract = new web3.eth.Contract(bridgeABI, bridgeAddress)


    let tx_hash = $("#xeq_swap_transaction_hash").val()

    console.log(tx_hash)

    let registerd = await bridge_contract.methods.isSwapRegistered(tx_hash).call()
    console.log(bridge_contract.methods)
    let claimed = await bridge_contract.methods.xeq_complete(tx_hash).call()
    console.log(claimed)

    if (registerd && !claimed)
    {
        $("#check_status").hide()
        $("#claim_wxeq_swap").show()
    } else {
        if(!claimed){
            $("#warning_text").text("Swap not registered yet! Try again later.")
            $("#warning_text").css("color", "red")
            $("#warning_text").show()
        } else {
            $("#warning_text").text("Swap already claimed!")
            $("#warning_text").css("color", "green")
            $("#warning_text").show()
        }
    }
})

$("#claim_wxeq_swap").click(async function(){

    let bridge_contract = new web3.eth.Contract(bridgeABI, bridgeAddress)

    let tx_hash = $("#xeq_swap_transaction_hash").val()

    let tx = await bridge_contract.methods.claim_from_xeq(tx_hash).send({from: selectedAccount})

    console.log(tx)
})

$("#register_swap").click(async function(){

    let xeq_address = $("#wxeq_swap_address").val()
    let wxeq_amount = $("#wxeq_swap_amount").val()
    $("#finished_wxeq_swap_amount").val(wxeq_amount)
    $("#finished_wxeq_swap_address").val(xeq_address)

    $("#swap_approve_amount").val(wxeq_amount)
    $("#start_swap").hide()
    $("#swap_approve").show()
})

$("#approve_swap").click(async function(){
    erc20Contract = new web3.eth.Contract(ERC20ABI, tokenAddress)

    let approved_coins = await erc20Contract.methods.allowance(selectedAccount, bridgeAddress).call()


    let amountString = $("#swap_approve_amount").val()
    let amount = web3.utils.toWei(amountString, 'ether')

    if(approved_coins  >= amount)
    {
        $("#swap_approve").hide()
        $("#finish_swap").show()
    }

    let approve_tx = await erc20Contract.methods.approve(bridgeAddress, amount).send({from:selectedAccount})
    console.log(approve_tx)
    if(approve_tx)
    {
        $("#swap_approve").hide()
        $("#finish_swap").show()
    }

})

$("#finish_swap").click(async function(){
    let bridge_contract = new web3.eth.Contract(bridgeABI, bridgeAddress)
    let wxeq_address = $("#finished_wxeq_swap_address").val()
    let wxeq_amount = $("#finished_wxeq_swap_amount").val()

    let amount = web3.utils.toWei(wxeq_amount, 'ether')

    let tx = await bridge_contract.methods.request_to_xeq(amount, wxeq_address).send({from: selectedAccount})

    console.log(tx)
})

$("#open_check_swap").click(async function(){
    $("#open_check_swap").hide();
    $("#check_swap_card").show();
    $("#register_swap_card").hide()
})

$("#close_check_swap").click(async function(){
    $("#open_check_swap").show();
    $("#check_swap_card").hide();
    $("#register_swap_card").show()
})

$("#deposit_withdraw_back").click(async function(){
    $("#new_withdrawal_button").show();
    $("#new_deposit_button").show();
    $("#deposit_withdraw_back").hide()
    $("#final_new_deposit_button").hide();
    $("#new_approve_button").hide();
    $("#deposit_withdraw_amount").attr("disabled", false)

})
$("#check_swap").click(async function(){
    $("#check_swap_status_message").html("Status: Waiting")
    $("#check_swap_status_message").attr("style", "color:yellow")
    $("#check_swap_status").show()
})



$("#new_deposit_button").click(async function(){

    $("#new_withdrawal_button").hide();
    $("#new_deposit_button").show();
    $("#new_approve_button").hide();
    $("#final_new_deposit_button").hide();
    $("#deposit_withdraw_back").show()

    let pool = document.querySelector("#staking_type").innerHTML


    if(pool == symbol+"-ETH")
    {
        pool_id = 1
        erc20Contract = new web3.eth.Contract(ERC20ABI, wxeqETHAddress)
    } else if (pool == symbol+"") {
        pool_id = 0
        erc20Contract = new web3.eth.Contract(ERC20ABI, tokenAddress)
    } else if(pool == symbol+"-USDC")
    {
        erc20Contract = new web3.eth.Contract(ERC20ABI, wxeqUSDCAddress)
        pool_id = 2
    }

    let approved_coins = await erc20Contract.methods.allowance(selectedAccount, stakingAddress).call()

    let amountString = $("#deposit_withdraw_amount").val()
    let amount = web3.utils.toWei(amountString, 'ether')

    console.log(approved_coins)

    if(approved_coins >= amount)
    {
        $("#final_new_deposit_button").show();
        $("#new_approve_button").hide()
    } else {
        $("#new_approve_button").show()
    }
    $("#new_deposit_button").hide()
    $("#deposit_withdraw_amount").attr("disabled", true)

})

$("#new_withdrawal_button").click(async function(){
    $("#new_deposit_button").hide();
    $("#deposit_withdraw_back").show()

    let pool_id = 0;
    let pool = document.querySelector("#staking_type").innerHTML

    if(pool == symbol +"-ETH")
    {
        pool_id = 1
    } else if (pool == symbol +"") {
        pool_id = 0
    } else if(pool == symbol +"-USDC")
    {
        pool_id = 2
    }

    stakingContract = new web3.eth.Contract(stakingContractAbi, stakingAddress)

    let amountString = $("#deposit_withdraw_amount").val()
    let amount = web3.utils.toWei(amountString, 'ether')

    if(amount > (await fetchStakedAccount(selectedAccount, pool_id)))
    {
        $("#new_withdrawal_button").show();
        $("#new_deposit_button").show();
        $("#deposit_withdraw_back").hide()
        $("#final_new_deposit_button").hide();
        $("#new_approve_button").hide();
        $("#deposit_withdraw_amount").attr("disabled", false)
    } else {
        let staking_tx = await stakingContract.methods.withdraw(pool_id, amount).send({from:selectedAccount});

        if (pool_id == 0)
        {
            document.querySelector("#user_staked").innerHTML = (await fetchStakedAccount(selectedAccount, 0) / 1e18).toLocaleString() + " " + symbol;
        }

        if (pool_id == 1)
        {
            document.querySelector("#user_staked").innerHTML = (await fetchStakedAccount(selectedAccount, 1) / 1e18).toLocaleString() + " "+symbol+"-ETH";
        }

        if (pool_id == 2)
        {
            document.querySelector("#user_staked").innerHTML = (await fetchStakedAccount(selectedAccount, 2) / 1e18).toLocaleString() + " "+symbol+"-USDC";
        }
    }

})

$("#new_approve_button").click(async function(){

    let pool_id = 0
    let pool = document.querySelector("#staking_type").innerHTML

    if(pool == "wXEQ-ETH")
    {
        pool_id = 1
        erc20Contract = new web3.eth.Contract(ERC20ABI, wxeqETHAddress)
    } else if (pool == "wXEQ") {
        pool_id = 0
        erc20Contract = new web3.eth.Contract(ERC20ABI, tokenAddress)
    } else if(pool == "wXEQ-USDC")
    {
        erc20Contract = new web3.eth.Contract(ERC20ABI, wxeqUSDCAddress)
        pool_id = 2
    }
    console.log(pool_id)

    let amountString = $("#deposit_withdraw_amount").val()
    let amount = web3.utils.toWei(amountString, 'ether')

    console.log(amount)

    let approve_tx = await erc20Contract.methods.approve(stakingAddress, amount).send({from:selectedAccount})
    if(approve_tx)
    {
        let approved_coins = await erc20Contract.methods.allowance(selectedAccount, stakingAddress).call()

        if(approved_coins > 0)
        {
            $("#new_approve_button").hide()
            $("#final_new_deposit_button").show()
        }
    }

})

$("#final_new_deposit_button").click(async function(){
    let pool_id = 0;
    let pool = document.querySelector("#staking_type").innerHTML

    if(pool == symbol+"-ETH")
    {
        pool_id = 1
    } else if (pool == symbol+"") {
        pool_id = 0
    } else if(pool == symbol+"-USDC")
    {
        pool_id = 2
    }

    console.log(pool_id)

    stakingContract = new web3.eth.Contract(stakingContractAbi, stakingAddress)

    let amountString = $("#deposit_withdraw_amount").val()
    let amount = web3.utils.toWei(amountString, 'ether')

    let staking_tx = await stakingContract.methods.deposit(pool_id, amount).send({from:selectedAccount});

    if (pool_id == 0)
    {
        document.querySelector("#user_staked").innerHTML = (await fetchStakedAccount(selectedAccount, 0) / 1e18).toLocaleString() + " " + symbol;
    }

    if (pool_id == 1)
    {
        document.querySelector("#user_staked").innerHTML = (await fetchStakedAccount(selectedAccount, 1) / 1e18).toLocaleString() + " "+symbol+"-ETH";
    }

    if (pool_id == 2)
    {
        document.querySelector("#user_staked").innerHTML = (await fetchStakedAccount(selectedAccount, 2) / 1e18).toLocaleString(undefined,
            {'minimumFractionDigits':2,'maximumFractionDigits':8}) + " "+symbol+"-USDC";
    }

})


$("#btn-disconnect").click(function(){
    $("#user_panel").hide()


})


/**
 * Main entry point.
 */
window.addEventListener('load', async () => {
  init();
  document.querySelector("#btn-connect").addEventListener("click", onConnect);
  document.querySelector("#btn-disconnect").addEventListener("click", onDisconnect);
  document.querySelector("#wXEQStaking").addEventListener("click", onWXEQ);
  document.querySelector("#wXEQETHStaking").addEventListener("click", onWXEQETH);
  document.querySelector("#wXEQUSDCStaking").addEventListener("click", onWXEQUSDC);

});

$(document).ready(function(){
    $("#user_panel").hide()
    $("#swap_panel").hide()
})
