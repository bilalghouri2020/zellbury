server {
    server_name  newpwazellbury.mustafashaban.com www.newpwazellbury.mustafashaban.com;
    #123
    #root   /home/zellbury/www/public_html;
    index  index.php index.html index.htm;


set $MAGE_ROOT /home/pwazellbury/www/public_html;
set $MAGE_DEBUG_SHOW_ARGS 1;
include /etc/nginx/zellbury-magento2.conf;


	location /phpmyadmin 
	{
	   root /usr/share/;
	   index index.php index.html index.htm;
	   location ~ ^/phpmyadmin/(.+\.php)$ {
	           try_files $uri =404;
	           root /usr/share;
	           fastcgi_pass unix:/var/run/php/php7.3-fpm.sock;
	           fastcgi_index index.php;
	           fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
	           include /etc/nginx/fastcgi_params;
	   }
	   location ~* ^/phpmyadmin/(.+\.(jpg|jpeg|gif|css|png|js|ico|html|xml|txt))$ {
	           root /usr/share/;
	   }
	}

	location /phpMyAdmin {
	       rewrite ^/* /phpmyadmin last;
	}


    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/newpwazellbury.mustafashaban.com-0001/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/newpwazellbury.mustafashaban.com-0001/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot


}
server {
    server_name  newpwazellbury.mustafashaban.com www.newpwazellbury.mustafashaban.com;
    listen 8080;
}
server {
    if ($host = www.newpwazellbury.mustafashaban.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    if ($host = newpwazellbury.mustafashaban.com) {
        return 301 https://$host$request_uri;
    } # managed by Certbot


    server_name  newpwazellbury.mustafashaban.com www.newpwazellbury.mustafashaban.com;
    listen 8080;
    return 404; # managed by Certbot

}
