// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;
// arrays, mapping, enums - Token2024 - erc20
// struct - grouping - person - first_name, last_name, age, gender etc
// ToDo: Dapp - TodoRoles - Todo's - explore RBAC - CONTRACTS
// - title,  status - bool - completed or incomplete - true, deadline - uint256, category - string
// address assignedTo
// memory - only when a function is called 
// storage - store on blockchain
// calldata - 

contract TodoRoles {
    mapping(address => bool) public admins;
    mapping(address => bool) public users;
    modifier onlyAdmin() {
        require(admins[msg.sender], "Not an admin");
        _;
    }
    //modifier function
    modifier onlyUser() {
        require(users[msg.sender] || admins[msg.sender], "Not a user");
        _;
    }

}

contract TodoManger {
    struct Todo {
        string title;
        bool completed;
        uint256 deadline;  
        int256 date; 
        string category;
        address assignedTo;
    }
    //| index |title| completed | deadline | assignedTo
    //| 0     | create erc20| true | 10/10/2024| jCDROr2QnljaKHutt60U85ZY5KcWHRV7|
    Todo[] public todos;
    event TodoCreated(uint256 indexed id, string text, uint256 deadline, string category);
    function createTodo(string calldata _title,  uint256 _deadline, string calldata _category, address _assignedTo) public {
        Todo memory newTodo = Todo({
           title: _title, 
           completed: false, 
           deadline: _deadline, 
           category: _category, 
           assignedTo: _assignedTo
        });
        todos.push(newTodo);
        emit TodoCreated(todos.length - 1, _text, _deadline, _category);
    }

    function getTodo(uint256 _index) public view returns (string memory title, bool completed, uint256 deadline, string memory category, address assignedTo )
    {
        Todo storage todo = todos[_index];
        return (todo.title, todo.completed, todo.deadline, todo.category, todo.assignedTo);
    }
}