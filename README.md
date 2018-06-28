# Welcome TeamBearcats
_This is a GDP-1 &amp; 2 project repository with team of five people._
## Team Members
### Raja Srikar Karthik Chinta
### Aditya Jytohiswaroop Malireddy 
### PhaniVardhan Gurram
### Pravalika Kawali
### Sangeetha Detne
***
![Bearcats](https://github.com/crskarthik/TeamBearcats/blob/master/Images/bearcat.jpg)
***
## Installation:
### Download Composer at https://getcomposer.org/download/
```CLI
php -r "copy('https://getcomposer.org/installer', 'composer-setup.php');"
php -r "if (hash_file('SHA384', 'composer-setup.php') === '544e09ee996cdf60ece3804abc52599c22b1f40f4323403c44d44fdfdd586475ca9813a858088ffbc1f233e9b180f061') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"
php composer-setup.php
php -r "unlink('composer-setup.php');"
```
### Install local packages:
* Open command prompt in ```/src/libraries/PhpSpreadsheet-develop/```
* Execute composer command (```composer install ```) to download and install required packages for project.
### Setting up database:
* Open http://localhost/phpmyadmin/
* Create new database with name "GDP"
* Navigate to IMPORT inside "GDP" database.
* Select and Import gdp.sql from /Database/ folder.
* You are set to go!
### Accessing Application
* Clone repo in C:\xampp\htdocs\
* Open http://localhost/GDPTeamBearcats/src/
