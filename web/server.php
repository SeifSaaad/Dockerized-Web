<?php

// Database configuration
$servername = "db";
$username = "root"; // Replace with your MySQL username
$password = "password"; // Replace with your MySQL password
$database = "team_database";

// Create connection
$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Function to fetch all team members
function fetchTeamMembers($conn) {
    $sql = "SELECT * FROM team_members";
    $result = $conn->query($sql);

    $teamMembers = array();
    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $teamMembers[] = $row;
        }
    }

    return $teamMembers;
}

// Function to fetch a specific team member by ID
function fetchTeamMemberById($conn, $id) {
    $sql = "SELECT * FROM team_members WHERE id = $id";
    $result = $conn->query($sql);

    if ($result->num_rows == 1) {
        return $result->fetch_assoc();
    } else {
        return null;
    }
}

// Function to add a new team member
function addMember($conn, $id, $name, $age, $cgpa) {
    $sql = "INSERT INTO team_members (id, name, age, cgpa) VALUES ($id, '$name', $age, $cgpa)";
    if ($conn->query($sql) === TRUE) {
        return true;
    } else {
        return false;
    }
}

// Function to update an existing team member
function updateMember($conn, $id, $name, $age, $cgpa) {
    $sql = "UPDATE team_members SET name='$name', age=$age, cgpa=$cgpa WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        return true;
    } else {
        return false;
    }
}

// Function to delete a team member
function deleteMember($conn, $id) {
    $sql = "DELETE FROM team_members WHERE id=$id";
    if ($conn->query($sql) === TRUE) {
        return true;
    } else {
        return false;
    }
}

// Handle incoming requests
if ($_SERVER["REQUEST_METHOD"] == "GET") {
    // Check if memberId is provided in the query string
    if (isset($_GET['memberId'])) {
        $memberId = $_GET['memberId'];
        $member = fetchTeamMemberById($conn, $memberId);
        if ($member) {
            echo json_encode($member);
        } else {
            echo json_encode(array("error" => "Member not found"));
        }
    } else {
        // Fetch all team members
        $teamMembers = fetchTeamMembers($conn);
        echo json_encode($teamMembers);
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Add new team member
    $data = json_decode(file_get_contents("php://input"), true);
    $id = $data['id'];
    $name = $data['name'];
    $age = $data['age'];
    $cgpa = $data['cgpa'];

    if (addMember($conn,$id, $name, $age, $cgpa)) {
        echo json_encode(array("message" => "Member added successfully"));
    } else {
        echo json_encode(array("error" => "Failed to add member"));
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "PUT") {
    // Update existing team member
    parse_str(file_get_contents("php://input"), $put_vars);
    $id = $put_vars['id'];
    $name = $put_vars['name'];
    $age = $put_vars['age'];
    $cgpa = $put_vars['cgpa'];

    if (updateMember($conn, $id, $name, $age, $cgpa)) {
        echo json_encode(array("message" => "Member updated successfully"));
    } else {
        echo json_encode(array("error" => "Failed to update member"));
    }
} elseif ($_SERVER["REQUEST_METHOD"] == "DELETE") {
    // Delete team member
    parse_str(file_get_contents("php://input"), $delete_vars);
    $id = $delete_vars['id'];

    if (deleteMember($conn, $id)) {
        echo json_encode(array("message" => "Member deleted successfully"));
    } else {
        echo json_encode(array("error" => "Failed to delete member"));
    }
}

// Close connection
$conn->close();

?>
