use starknet::ContractAddress;

#[starknet::interface]
trait IERC20<TContractState> {
    fn balance_of(self: @TContractState, account: ContractAddress) -> u256;
    fn transfer(ref self: TContractState, recipient: ContractAddress, amount: u256) -> bool;
    fn transfer_from(
        ref self: TContractState, sender: ContractAddress, recipient: ContractAddress, amount: u256
    ) -> bool;
}

trait IStarUser<TContractState> {
    fn setUser(bool starkDomain, bool twitter, bool discord, u8 age, bool frequency, bool maxAmount, u8 NumberNFT, felt252 refereal1, felt252 refereal2) -> bool;
    fn makeLoan(u16 deposit, felt252: creditor) -> bool;
    fn rePayLoan(felt252: creditor) -> bool;
}


#[starknet::contract]
mod IstarUser {
    use super::{IERC20Dispatcher, IERC20DispatcherTrait};

    #[storage]
    struct Storage {
        fundationPool: felt252,
        Users: legacyMap<ContractAddress, User>
    }

    #[derive(Drop, starknet::Event)]
    struct User{
        twitter: bool,
        discord: bool,
        starkDomain: string,
        hasDomain: bool,
        NumberofTransaction: u8,
        age: u8,
        frequency: bool,
        maxAmount: bool,
        NumberNFT: u8,
        refereal1: felt252,
        refereal2: felt252,
        authorized: bool,
        deposit: u16,
        credit: u16,
        delegate: u16,
        startTime: u256,
        duration: u256,
    }

    #[abi(embed_v0)]
    impl IstarUserImpl of super::IStarUser<ContractState> {
        fn setUser(self: TContractState, bool starkDomain, bool twitter, bool discord, u8 age, bool frequency, bool maxAmount, u8 NumberNFT, felt252 refereal1, felt252 refereal2) -> bool {
            fn new() -> User;
            User.twitter = twitter;
            User.discord = discord;
            User.starkDomain = starkDomain;
            User.age = age;
            User.frequency = frequency;
            User.maxAmount = maxAmount;
            User.NumberNFT = NumberNFT;
            User.refereal1 = refereal1;
            User.refereal2 = refereal2;
            User.authorized = true;

            self.Users[msg.sender] = User;
            return true;
        }
        
        fn makeLoan(self: TContractState, u16 deposit, felt252: creditor) -> bool {
            self.deposit = deposit;
            self.credit = deposit * 2;
            self.delegate = deposit * 3;
            self.startTime = now();
            self.duration = 30 days;
            return true;
        }

        fn rePayLoan(self: TContractState, felt252: creditor) -> bool {
            self.credit = 0;
            self.delegate = 0;
            self.startTime = 0;
            self.duration = 0;
            return true;
        }
    } 
}


