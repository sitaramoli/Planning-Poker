<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: access");
header("Access-Control-Allow-Methods: POST");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

require __DIR__ . '/classes/Database.php';
$db_connection = new Database();
$conn = $db_connection->dbConnection();

function getUUID()
{
    $data = random_bytes(16);
    $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // Set version to 0100
    $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // Set bits 6-7 to 10
    return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
}

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
    !isset($data->name)
    || !isset($data->description)
    || !isset($data->user_id)
    || empty(trim($data->name))
    || empty(trim($data->description))
    || empty(trim($data->user_id))
):

    $fields = ['fields' => ['name', 'description']];
    $returnData = msg(0, 422, 'Please Fill in all Required Fields!', $fields);

    // IF THERE ARE NO EMPTY FIELDS THEN-
else:
    $name = trim($data->name);
    $description = trim($data->description);
    $user_id = trim($data->user_id);
    try {
        $id = getUUID();
        $conn->beginTransaction();

        // insert in sessions table
        $insert_query = "INSERT INTO `sessions`(`id`,`name`,`description`) VALUES(:id,:name,:description)";
        $insert_stmt = $conn->prepare($insert_query);
        // DATA BINDING
        $insert_stmt->bindValue(':name', htmlspecialchars(strip_tags($name)), PDO::PARAM_STR);
        $insert_stmt->bindValue(':id', $id, PDO::PARAM_STR);
        $insert_stmt->bindValue(':description', $description, PDO::PARAM_STR);
        $insert_stmt->execute();

        // insert in participants table
        $insert_query = "INSERT INTO `participants`(`user_id`,`role`,`session_id`) VALUES(:user_id,'moderator',:id)";
        $insert_stmt = $conn->prepare($insert_query);
        // DATA BINDING
        $insert_stmt->bindValue(':user_id', $user_id, PDO::PARAM_INT);
        $insert_stmt->bindValue(':id', $id, PDO::PARAM_STR);
        $insert_stmt->execute();

        $conn->commit();

        $returnData = [
            'success' => 1,
            'message' => 'Session created successfully',
            'data' => ['id' => $id]
        ];
    } catch (PDOException $e) {
        $conn->rollBack();
        $returnData = [
            'success' => 0,
            'message' => 'Error creating session: ' . $e->getMessage()
        ];
    }
endif;

echo json_encode($returnData);