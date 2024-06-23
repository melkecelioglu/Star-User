// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IERC20 {
    function transfer(address recipient, uint256 amount) external returns (bool);
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract StarkUser {
    enum CreditScore {
        BAD,
        MEDIUM,
        GOOD,
        MASTER
    }

    enum NumberOfTransaction {
        TOLOW, //<150
        MINIMUM, //150
        MEDIUM, //250
        GOOD, //400
        HIGH, //600
        VERYHIGH //1000
    }

    enum AGE {
        BABY, // < 3
        NEWCOMMER, // > 3
        MEMBER, // > 6
        SENIOR, // > 12
        OG // > 18
    }

    IERC20 private strkToken;
    address private owner;
    address pool;
    mapping(address => User) private users;
    mapping(address => bool) private balance;

    struct User {
        string  addrr;
        CreditScore   creditScore ;
        bool    twitter;
        bool    discord;
        bool    starkDomain;
        NumberOfTransaction numberOfTransaction;
        AGE     age;
        bool    frequency;
        bool    MaxAmount;
        uint8   NFT;
        address[2] refereal;
        uint16  credit;
        uint16  deposit;
        uint16  delegate;
        uint256 startTime;
        uint256 duration;
        bool    autorized;
    }

// Contract STRK: 0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
    constructor(address _strkToken, address _pool) {
        owner = msg.sender;
        pool = _pool;
        strkToken = IERC20(_strkToken);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Access restricted to the contract owner");
        _;
    }

    modifier onlySelf() {
        require(msg.sender == address(this), "Access restricted to the contract itself");
        _;
    }

    function setAllData(bool starkDomain, uint8 age, uint16 amount, uint8 NFT, address refereal1, bool frequency) public {
        set_Stark_Domain(msg.sender);
        set_Age(msg.sender, age);
        set_Number_Of_Transaction(msg.sender, amount);
        set_NFT(msg.sender, NFT);
        register_referal(refereal1);
        set_frequency(msg.sender);
    }




    // Function to calculate the credit score of a user
    function calculateCreditScore() public{
        User user = users[msg.sender];
        uint8 creditScore = 0;
        if (user.starkDomain) {
            creditScore += 25;
        }
        if (user.age == AGE.BABY) {
            creditScore += 25;
        } else if (user.age == AGE.NEWCOMMER) {
            creditScore += 20;
        } else if (user.age == AGE.MEMBER) {
            creditScore += 15;
        } else if (user.age == AGE.SENIOR) {
            creditScore += 10;
        } else if (user.age == AGE.OG) {
            creditScore += 5;
        }
        if (users.frequency == true) {
            creditScore += 20;
        }
        if (user.numberOfTransaction == NumberOfTransaction.MINIMUM) {
            creditScore += 9;
        } else if (user.numberOfTransaction == NumberOfTransaction.MEDIUM) {
            creditScore += 12;
        } else if (user.numberOfTransaction == NumberOfTransaction.GOOD) {
            creditScore += 16;
        } else if (user.numberOfTransaction == NumberOfTransaction.HIGH) {
            creditScore += 21;
        } else if (user.numberOfTransaction == NumberOfTransaction.VERYHIGH) {
            creditScore += 29;
        }
        if (user.NFT == 1){
            creditScore += 3;
        } else if (user.NFT == 2){
            creditScore += 5;
        } else if (user.NFT == 3){
            creditScore =+ 11;
        }
        if creditScore < 65 {
            user.creditScore = CreditScore.BAD;
        } else if creditScore < 71 {
            user.creditScore = CreditScore.MEDIUM;
        } else if creditScore < 83 {
            user.creditScore = CreditScore.GOOD;
        } else if creditScore >= 100{
            user.creditScore = CreditScore.MASTER;
        }
    }

    function set_Twitter(address user) public returns (bool) {
        users[user].twitter = true;
    }

    function set_Discord(address user) public returns (bool) {
        users[user].discord = true;
    }

    function set_Stark_Domain(address user) public returns (bool) {
        user.starkDomain = true;
    }

    function set_Number_Of_Transaction(address user, uint16 amount) public returns (NumberOfTransaction) {
        if (amount > 1000){
            user.numberOfTransaction = NumberOfTransaction.VERYHIGH;
        } else if (amount > 600){
            user.numberOfTransaction = NumberOfTransaction.HIGH;
        } else if (amount > 400){
            user.numberOfTransaction = NumberOfTransaction.GOOD;
        } else if (amount > 250){
            user.numberOfTransaction = NumberOfTransaction.MEDIUM;
        } else if (amount > 150){
            user.numberOfTransaction = NumberOfTransaction.MINIMUM;
        } else {
            user.numberOfTransaction = NumberOfTransaction.TOLOW;
        }
        user.numberOfTransaction = NumberOfTransaction.MINIMUM;
    }

    function set_Frequency(address user) public returns (bool) {
        users[user].frequency = true;
    }

    function set_Age(address user, uint8 age) public returns (AGE) {
        if(age > 18) {
            users[user].age = AGE.OG;
        } else if (age > 12) {
            users[user].age = AGE.SENIOR;
        } else if (age > 6) {
            users[user].age = AGE.MEMBER;
        } else if (age > 3) {
            users[user].age = AGE.NEWCOMMER;
        } else {
            users[user].age = AGE.BABY;
        }
    }

    function set_MaxAmount(address user, bool _maxAmount) public returns (bool) {
        users[user].MaxAmount = _maxAmount;
    }

    function set_NFT(address user) public returns (uint8) {
        //ToDO
    }

    function borrow(address user, uint256 _amount) public {
        require(_amount > 0, "Amount must be greater than 0");

        require(strkToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        users[user].deposit += _amount;

        require(getFoudationSTRK(_amount * 1.3), "Fail to get the loan");
        users[user].credit = _amount * 1.3;
        require(delegateToken((_amount + users[user].credit) * 0.4), user), "Failed to delegate");
        users[user].delegate = (_amount + users[user].credit) * 0.4;
        require(strkToken.transfer(msg.sender, users[user].credit + users[user].deposit - users[user].delegate), "Transfer failed");
        users[user].deposit -= 0.6 * users[user].credit;
        users[user].startTime = block.timestamp;
        users[user].duration = 30 days;
    }

    function repay(address user) public {
        require(users[user].delegate > 0, "No delegate found");
        require(undelegate_STRK(users[user].delegate, user), "Failed to undelegate");
        users[user].delegate = 0;
        require(strkToken.transfer(pool, users[user].credit, "Transfer failed"));
        users[user].credit = 0;
        require(strkToken.transfer(user, users[user].deposit, "Transfer failed"));
        users[user].deposit = 0;

    }

    function auto_Repay(address user) public {
        if(users[user].startTime + users[user].duration < block.timestamp) {
            require(users[user].delegate > 0, "No delegate found");
            require(undelegate_STRK(users[user].delegate, user), "Failed to undelegate");
            users[user].delegate = 0;
            require(strkToken.transfer(pool, users[user].credit, "Transfer failed"));
            users[user].credit = 0;
            require(strkToken.transfer(user, users[user].deposit, "Transfer failed"));
            users[user].deposit = 0;
        }
    }

    function getFoundationSTRK(uint16 amount) onlySelf() private {
        require(_amount > 0, "Amount must be greater than 0");
        require(strkToken.transferFrom(pool, address(this), _amount), "Transfer failed");
    }



    function delegate_STRK(uint256 amount, address borrower) private onlySelf() {
        //ToDO
    }

//0x0782f0ddca11d9950bc3220e35ac82cf868778edb67a5e58b39838544bc4cd0f
//Function unlock(amount)
    function undelegate_STRK(uint256 amount, address borrower) private onlySelf() {
        //ToDO
    }

    function verify_Last_Vote(address user){
        //ToDO

    }

    function register_referal(address refereal) public {
        //ToDO
        require(users[refereal].refereal[0] == msg.sender || users[refereal].refereal[1] == msg.sender);
        users[msg.sender].autorized = True;

}