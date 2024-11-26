// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

contract TodoRoles {
    // Mapping for admins and users
    mapping(address => bool) public admins;
    mapping(address => bool) public users;

    // Modifier to restrict access to admins
    modifier onlyAdmin() {
        require(admins[msg.sender], "Not an admin");
        _;
    }

    // Modifier to restrict access to users (or admins)
    modifier onlyUser() {
        require(users[msg.sender] || admins[msg.sender], "Not a user");
        _;
    }
}

contract TodoManager {
    // Define the Todo structure
    struct Todo {
        string title;
        bool completed;
        uint256 deadline;
        string category;
        address assignedTo;
    }

    // Array to store all Todos
    Todo[] public todos;

    // Event emitted when a new Todo is created
    event TodoCreated(uint256 indexed id, string title, uint256 deadline, string category);

    // Function to create a new Todo
    function createTodo(
        string calldata _title,
        uint256 _deadline,
        string calldata _category,
        address _assignedTo
    ) public {
        // Create a new Todo and add it to the todos array
        Todo memory newTodo = Todo({
            title: _title,
            completed: false,
            deadline: _deadline,
            category: _category,
            assignedTo: _assignedTo
        });

        todos.push(newTodo);

        // Emit the TodoCreated event
        emit TodoCreated(todos.length - 1, _title, _deadline, _category);
    }

    // Function to get the details of a Todo by its index
    function getTodo(
        uint256 _index
    )
        public
        view
        returns (
            string memory title,
            bool completed,
            uint256 deadline,
            string memory category,
            address assignedTo
        )
    {
        Todo storage todo = todos[_index];
        return (todo.title, todo.completed, todo.deadline, todo.category, todo.assignedTo);
    }
}
