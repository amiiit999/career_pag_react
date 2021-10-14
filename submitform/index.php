
<?php
include 'connect.php';
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
header('Content-Type: application/json; charset=utf-8');


$rest_json = (file_get_contents("php://input"));

//$data = json_decode($rest_json,true);




if (isset($_POST['name']) && !empty($_POST['email']) && !empty($_POST['phonenumber'])) {

  $name = $_POST['name'];
  $email = $_POST['email'];

  $mobileno = $_POST['phonenumber'];

  if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(["email_sent" => false, "message" => "Please enter valid email Id"]);
   
  }
  elseif(!preg_match("/^[6-9][0-9]{9}$/", $mobileno)) {
    echo json_encode(["phone_sent" => false, "message" => "Please enter valid phone no."]);

  }
  else{

  $currentDateTime = date('Y-m-d H:i:s');
  $allowedExts = array("pdf", "doc");
  $temp = explode(".", $_FILES["file"]["name"]);
  $extension = end($temp);
  if (($_FILES["file"]["type"] == "application/pdf") || ($_FILES["file"]["type"] == "application/doc")
    && ($_FILES["file"]["size"] < 200000)
    && in_array($extension, $allowedExts)
  ) {
    if ($_FILES["file"]["error"] > 0) {
      echo "Return Code: " . $_FILES["file"]["error"] . "<br>";
    } else {
      $file_tmp = $_FILES['file']['tmp_name'];
      $file_ext = strtolower(end(explode('.', $_FILES['file']['name'])));
      $file = $_FILES["file"]["name"];
      if (!$conn) {
        die("Connection failed: " . mysqli_connect_error());
      }
      $sql = "INSERT INTO users (fullname, emailid, mobileno, cvfiles,status,created_at) VALUES ('$name','$email','$mobileno','$file','1','$currentDateTime')";
      if ($conn->query($sql) === TRUE) {
        $last_id = $conn->insert_id;
        $last_name = $conn->insert_fullname;

        $folderPath = __DIR__ . "/uploads/" . $last_id . "_" . str_replace(' ', '_', $_POST['name']) . "/";

        mkdir($folderPath);
        chmod($folderPath, 0777);

        $file_tmp = $_FILES['file']['tmp_name'];
        $file_ext = strtolower(end(explode('.', $_FILES['file']['name'])));
        $file = $_FILES["file"]["name"];
        move_uploaded_file($_FILES['file']['tmp_name'], $folderPath . $file);
        //echo "New record created successfully. Last inserted ID is: " . $last_id;
        echo json_encode(["sent" => true, "message" => "Your CV is submitted successfully !!"]);
      } else {
        //echo "Error: " . $sql . "<br>" . $conn->error;
      }
    }
  } else {
    echo json_encode(["sent" => false, "message" => "Please upload your CV in either pdf or doc format."]);
  }


  }




  mysqli_close($conn);
} else {
  //echo json_encode(["sent" => false, "message" => "Please fill up required details!!."]);
}
?>