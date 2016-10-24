<?php

$db = new PDO('sqlite:notes.sqlite');

$checkTable = $db->query("SELECT 1 FROM notes");
if (!$checkTable) {
    $db->exec("CREATE TABLE notes (id integer primary key, title text, content text, color text)");
}

function save()
{
    try {
        global $db;
        $check = $db->query("SELECT MAX(id) AS id FROM notes");
        $maxId = $check->fetch(PDO::FETCH_ASSOC);
        $data = array(
            'id' => ((int) $maxId['id'] + 1),
            'title' => $_POST['title'],
            'content' => $_POST['content'],
            'color' => $_POST['color'],
            'created_date' => date('Y-m-d H:i:s'),
            'status' => 'y'
        );

        $stmt = $db->prepare("INSERT INTO notes (id, title, content, color, created_date, status) VALUES (:id, :title, :content, :color, :created_date, :status)");
        $save = $stmt->execute($data);
        if ($save) {
            return array(
                'error' => null,
                'msg' => 'Notes saved'
            );
        } else {
            return array(
                'error' => 'Failed while saving into database',
                'msg' => 'Failed while saving into database'
            );
        }
    } catch (Exception $e) {
        return array(
            'error' => $e->getMessage(),
            'msg' => $e->getMessage()
        );
    }


}

function update()
{
    try {
        global $db;
        $data = array(
            'id' => $_POST['id'],
            'title' => $_POST['title'],
            'content' => $_POST['content'],
            'color' => $_POST['color'],
            'created_date' => date('Y-m-d H:i:s')
        );
        $stmt = $db->prepare("UPDATE notes SET title = :title, content = :content, color = :color, created_date = :created_date WHERE id = :id");
        $save = $stmt->execute($data);
        if ($save) {
            return array(
                'error' => null,
                'msg' => 'Notes saved'
            );
        } else {
            return array(
                'error' => 'Failed while saving into database',
                'msg' => 'Failed while saving into database'
            );
        }
    } catch (Exception $e) {
        return array(
            'error' => $e->getMessage(),
            'msg' => $e->getMessage()
        );
    }
}

function delete()
{
    try {
        global $db;
        $data = array(
            'id' => $_POST['id'],
            'status' => 'd'
        );
        $stmt = $db->prepare("UPDATE notes SET status = :status WHERE id = :id");
        $save = $stmt->execute($data);
        if ($save) {
            return array(
                'error' => null,
                'msg' => 'Notes deleted'
            );
        } else {
            return array(
                'error' => 'Failed while saving into database',
                'msg' => 'Failed while saving into database'
            );
        }
    } catch (Exception $e) {
        return array(
            'error' => $e->getMessage(),
            'msg' => $e->getMessage()
        );
    }
}

function getNotes()
{
    global $db;

    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $notes = $db->query("SELECT * FROM notes  WHERE id = ".(int) $_GET['id']);
    } else {
        $sql = "WHERE status = \"y\"";
        if (isset($_GET['status']) && !empty($_GET['status'])) {
            $sql = "WHERE status = \"".$_GET['status']."\"";
        }
        $notes = $db->query("SELECT * FROM notes ".$sql);
    }

    $res = $notes->fetchAll(PDO::FETCH_ASSOC);
    if (is_array($res) && count($res) > 0) {
        return $res;
    } else {
        return array();
    }
}
header('Content-Type: Application/json');
switch (@$_GET['action']) {
    case 'save':
        $save = save();
        echo json_encode($save);
        break;

    case 'update':
        $save = update();
        echo json_encode($save);
        break;
    case 'delete':
        $save = delete();
        echo json_encode($save);
        break;
    default:
        $notes = getNotes();
        echo json_encode($notes);
        break;
}
