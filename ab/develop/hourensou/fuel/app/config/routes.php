<?php
return array(
	'_root_'  => 'index/index',
	'_404_'   => 'welcome/404',

	'hello(/:name)?' => array('welcome/hello', 'name' => 'hello'),
);
