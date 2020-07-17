-> Install mysql locally in linux

sudo apt-get update
sudo apt-get install mysql-server

-> Start local mysql

sudo systemctl start mysql

-> Auto start mysql on reboot

sudo systemctl enable mysql

->Start mysql shell and create user

sudo mysql -u root -p
Enter Password:''
SET GLOBAL validate_password_policy=LOW;
CREATE USER 'innofund'@'localhost' IDENTIFIED WITH 'mysql_native_password' BY 'innofund';
GRANT ALL PRIVILEGES ON * . * TO 'innofund'@'localhost';
FLUSH PRIVILEGES;

-> Create database for app

sudo mysql -u innofund -p
Enter Password: 'innofund'
CREATE DATABASE innofunddb;

-> use mysql with node

https://codeforgeek.com/nodejs-mysql-tutorial/

