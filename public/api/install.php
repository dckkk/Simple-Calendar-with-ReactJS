<?php

$db = new PDO('sqlite:calendar.sqlite');

$checkTable = $db->query("SELECT 1 FROM calendar");
if (!$checkTable) {
    $install = $db->exec("CREATE TABLE IF NOT EXISTS 'calendar' (
               'id' int(11) NOT NULL primary key,
               'title' varchar(255) NOT NULL,
               'color' varchar(255) NOT NULL,
               'start' varchar(48) NOT NULL,
               'end' varchar(48) NOT NULL,
               'allDay' varchar(5) NOT NULL
            )");
    if ($install) {
        echo json_encode(array(
            'error' => null,
            'msg' => 'Calendar installed'
        ));
    } else {
        echo json_encode(array(
            'error' => 'Install failed!',
            'msg' => 'Installation failed!. cant create table'
        ));
    }
} else {
    echo json_encode(array(
        'error' => 'Calendar already installed',
        'msg' => 'Calendar already installed'
    ));
}
