<?php

$db = new PDO('sqlite:calendar.sqlite');

$checkTable = $db->query("SELECT 1 FROM calendar");
if (!$checkTable) {
    $db->exec("CREATE TABLE IF NOT EXISTS 'calendar' (
               'id' int(11) NOT NULL primary key,
               'title' varchar(255) NOT NULL,
               'description' varchar(255) NOT NULL,
               'start' int (11) NOT NULL,
               'end' int (11) NOT NULL,
               'allDay' varchar(5) NOT NULL
            )");
}

function save()
{
    try {
        global $db;
        $check = $db->query("SELECT MAX(id) AS id FROM calendar");
        $maxId = $check->fetch(PDO::FETCH_ASSOC);
        $data = array(
            'id' =>  ((int) $maxId['id'] +1),
            'title' => $_POST['title'],
            'description' => $_POST['description'],
            'start' => strtotime($_POST['start']),
            'end' => strtotime($_POST['end']),
            'allDay' => $_POST['allDay']
        );

        $stmt = $db->prepare("INSERT INTO calendar (id, title, description, start, end, allDay) VALUES (:id, :title, :description, :start, :end, :allDay)");
        $save = $stmt->execute($data);
        if ($save) {
            $data['id'] = $db->lastInsertId();
            $data['start'] = date('Y-m-d H:i:s', $data['start']);
            $data['end'] = date('Y-m-d H:i:s', $data['end']);
            return array(
                'error' => null,
                'msg' => 'Event saved',
                'record' => $data
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
            'description' => $_POST['description'],
        );
        $stmt = $db->prepare("UPDATE calendar SET title = :title, description = :description WHERE id = :id");
        $save = $stmt->execute($data);
        if ($save) {
            $query = $db->query("SELECT * FROM calendar  WHERE id = ".(int) $_POST['id']);
            $data = $query->fetchAll(PDO::FETCH_ASSOC)[0];
            $data['start'] = date('Y-m-d H:i:s', $data['start']);
            $data['end'] = date('Y-m-d H:i:s', $data['end']);
            return array(
                'error' => null,
                'msg' => 'Event updated',
                'records' => $data
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
            'id' => $_POST['id']
        );
        $stmt = $db->prepare("DELETE FROM calendar WHERE id = :id");
        $save = $stmt->execute($data);
        if ($save) {
            return array(
                'error' => null,
                'msg' => 'Event deleted',
                'id' => $_POST['id']
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

function getCalendar()
{
    global $db;
    $_GET['start'] = !isset($_GET['start']) ? date("Y-m")."-01 00:00:00" : $_GET['start'];
    $_GET['end'] = !isset($_GET['end']) ? date("Y-m-t")." 00:00:00" : $_GET['end'];


    if (isset($_GET['id']) && !empty($_GET['id'])) {
        $calendar = $db->query("SELECT * FROM calendar WHERE id = ".(int) $_GET['id']);
    } else {
        $calendar = $db->query("SELECT * FROM calendar WHERE start 
            BETWEEN ".strtotime($_GET['start']) ." AND ".strtotime($_GET['end']));
    }

    $res = $calendar->fetchAll(PDO::FETCH_ASSOC);
    if (is_array($res) && count($res) > 0) {
        foreach ($res as $key => $value) {
             $res[$key]['start'] = date("Y-m-d H:i:s", $value['start']);
             $res[$key]['end'] = date("Y-m-d H:i:s", $value['end']);
        }
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
        $calendar = getCalendar();
        echo json_encode($calendar);
        break;
}
