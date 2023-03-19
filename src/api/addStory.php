<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__ . '/classes/Database.php';
$db_connection = new Database();
$conn = $db_connection->dbConnection();

function msg($success, $status, $message, $extra = [])
{
    return array_merge([
        'success' => $success,
        'status' => $status,
        'message' => $message
    ], $extra);
}

// DATA FORM REQUEST
$data = json_decode(file_get_contents("php://input"));
$returnData = [];

if ($_SERVER["REQUEST_METHOD"] != "POST"):

    $returnData = msg(0, 404, 'Page Not Found!');

elseif (
    !isset($data->story)
    || !isset($data->description)
    || !isset($data->session_id)
    || empty(trim($data->story))
    || empty(trim($data->description))
    || empty(trim($data->session_id))
):

    $fields = ['fields' => ['story']];
    $returnData = msg(0, 422, 'Please Fill in all Required Fields!', $fields);

    // IF THERE ARE NO EMPTY FIELDS THEN-
else:

    $story = trim($data->story);
    $description = trim($data->description);
    $session_id = trim($data->session_id);
    try {

        $insert_query = "INSERT INTO `stories`(`name`,`description`,`session_id`) VALUES(:name,:description,:session_id)";
        $insert_stmt = $conn->prepare($insert_query);

        // DATA BINDING
        $insert_stmt->bindValue(':name', filter_var($story, FILTER_SANITIZE_STRING));
        $insert_stmt->bindValue(':description', filter_var($description, FILTER_SANITIZE_STRING));
        $insert_stmt->bindValue(':session_id', filter_var($session_id, FILTER_SANITIZE_STRING));
        $insert_stmt->execute();

        $returnData = msg(1, 201, 'Story added successfully.');
    } catch (PDOException $e) {
        $returnData = msg(0, 500, $e->getMessage());
    }

endif;

echo json_encode($returnData);