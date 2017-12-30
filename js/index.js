/**
 * TO COMPILE A CONTRACT
 * 
 * Install solc command line tool for your operating system
 * solc --bin contract.sol // Copy the binary code and use it below
 * solc --abi contract.sol // Copy the abi code and use it below
 * 
 * 
 * TO DEPLOY A CONTRACT
 * 
 * geth attach http://localhost:8545 // Start geth and connect to local rpc server
 * 
 * // Commands to be run inside the geth console
 * var abi = ABI code from solc;
 * var byteCode = 'Byte code from solc';
 * var candidateList = ['mark-otto', 'jacob-thornton', 'larry-bird'];
 * 
 * var VotingContract = web3.eth.contract(abi);
 * var votingContract = VotingContract.new(candidateList, {data: byteCode, from: web3.eth.accounts[0], gas: 4700000, gasPrice: '20000000000'});
 * 
 * votingContract.address // Keep contract address which will be used anytime we want to interact with contract
**/



jQuery(document).ready(function($) {
  if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
  }
  else {
    web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); // Use server and port
  }
  // Use ABI code gotten above
  var abi = [{"constant":true,"inputs":[{"name":"_candidate","type":"bytes32"}],"name":"totalVotesFor","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"_candidate","type":"bytes32"}],"name":"validCandidate","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"bytes32"}],"name":"votesReceived","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"candidateList","outputs":[{"name":"","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_candidate","type":"bytes32"}],"name":"voteForCandidate","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_candidates","type":"bytes32[]"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"}];
  var VotingContract = web3.eth.contract(abi);
  var contract = VotingContract.at('0x720bc16fef0e9bfadbb330f729328b6d9fea8e88'); // Use contract address gotten above
  var fromAccount = web3.eth.accounts[0]; // Use the first account
  var candidateList = ['mark-otto', 'jacob-thornton', 'larry-bird'];  // Voting Candidates

  $('.vote-button').click(function(e) {
    var tr = $(e.target).closest('tr');
    var name = tr.data('name');
    
    voteCandidate(name, function(vote) {
      setCandidateVote(name, vote);
    });
  });

  function voteCandidate(name, callback) {
    contract.voteForCandidate(name, {from: fromAccount}, function() {
      var vote = getCandidateVote(name);
      callback(vote);
    });
  }

  function getCandidateVote(name) {
    return contract.totalVotesFor(name);
  }

  function setCandidateVote(name, vote) {
    var tr = $('*[data-name="' + name + '"]');
    var td = $(tr).find('.vote-count');
    $(td).text(vote.toString());
  }

  function initVotes() {
    candidateList.forEach(function(name) {
      var vote = getCandidateVote(name);
      setCandidateVote(name, vote);
    });
  }

  initVotes();  // Initial votes on startup
});