
sudo npm run build

cd /var/www/html/Zellbury/magento2/public_html/;
sudo php bin/magento s:up
sudo php bin/magento s:s:d -f
sudo php bin/magento c:f
sudo php bin/magento c:c
sudo chmod -R 777 pub var generated

