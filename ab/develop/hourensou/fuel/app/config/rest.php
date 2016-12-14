<?php
/*
 * アプリケーション用のrest設定
 * アプリケーションで個別に設定する場合はこちらを使用する。
 *
 * コピー元はfuel/core/config/rest.php
 */

return array(

	/*
	| What format should the data be returned in by default?
	|
	|	Default: xml
	|
	*/
	'default_format' => 'json',

	/*
	| XML Basenode name
	|
	|	Default: xml
	|
	*/
	'xml_basenode' => 'xml',

	/*
	| Name for the password protected REST API displayed on login dialogs
	|
	|	E.g: My Secret REST API
	|
	*/
	'realm' => 'REST API',

	/*
	| Is login required and if so, which type of login?
	|
	|	'' = no login required,
	| 'basic' = unsecure login,
	| 'digest' = more secure login
	| or define a method name in your REST controller that handles authorization
	|
	*/
	'auth' => '',

	/*
	| array of usernames and passwords for login
	|
	|	array('admin' => '1234')
	|
	*/
	'valid_logins' => array('admin' => '1234'),

	/*
	| Ignore HTTP_ACCEPT
	|
	| A lot of work can go into detecting incoming data,
	| disabling this will speed up your requests if you do not use a ACCEPT header.
	|
	*/
	'ignore_http_accept' => true,

);
