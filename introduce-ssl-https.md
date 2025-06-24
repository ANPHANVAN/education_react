Run project in production


Create ssl https:
- chuẩn bị tên miền, A tên miền trỏ thẳng về IP của vps
- vào cloudflare vào ssl/tls configure để thành Full(strict)

Bước 1: Kiểm tra DNS
    Mục đích: Đảm bảo domain hdp.io.vn và www.hdp.io.vn trỏ đúng đến IP của EC2 (18.142.252.16).
    bash: 
        dig hdp.io.vn
        dig www.hdp.io.vn

Bước 2: Kiểm tra cổng 80
    bash:
        sudo ufw status
        sudo ufw allow 80
    Kỳ vọng: ufw status cho thấy cổng 80 được phép (ALLOW).
    Lỗi: mở cổng bên ec2 hoặc liên hệ bên cung cấp vps

Bước 3: Chuẩn bị thư mục webroot
    Mục đích: Tạo thư mục để Certbot lưu tệp thử thách và đảm bảo Nginx có thể truy cập. (vì mount ./nginx/certbot vào nginx rồi )
    bash:
        mkdir -p ./nginx/certbot/www/.well-known/acme-challenge
        chmod -R 755 ./nginx/certbot/www
        mkdir -p ./nginx/certbot/conf
        chmod -R 755 ./nginx/certbot/conf

    Tạo tệp thử nghiệm coi nginx có lấy được thông tin trong text không
    bash:    
        echo "test" > ./nginx/certbot/www/.well-known/acme-challenge/test.txt

Bước 4: Cập nhật cấu hình Nginx
    Mục đích: Đảm bảo Nginx phục vụ tệp thử thách qua HTTP và không chuyển hướng sang HTTPS.

    Thực hiện: Sửa tệp ./nginx/nginx.conf thành
        events {
            worker_connections 1024;
            }

            http {
            include mime.types;
            default_type application/octet-stream;

            upstream express {
                server express:3000;
            }

            server {
                listen 80;
                server_name hdp.io.vn www.hdp.io.vn;

                location /.well-known/acme-challenge/ {
                root /var/www/certbot;
                try_files $uri $uri/ =404;
                }

                location / {
                root /var/www/certbot;
                try_files $uri $uri/ =404;
                }
            }
        }

        Location /.well-known/acme-challenge/ phục vụ tệp thử thách từ /var/www/certbot.
        Location / tạm thời trả về nội dung từ /var/www/certbot để kiểm tra, tránh chuyển hướng HTTPS.
        Bỏ khối server cổng 443 tạm thời vì chưa có chứng chỉ SSL.
    
    Khởi động lại Nginx:
    bash:
        docker compose restart nginx
    
Bước 5: Kiểm tra truy cập tệp thử thách
    Mục đích: Xác nhận Nginx phục vụ tệp thử thách qua HTTP.
    bash:
        curl -I http://hdp.io.vn/.well-known/acme-challenge/test.txt
        curl -I http://www.hdp.io.vn/.well-known/acme-challenge/test.txt
    Kỳ vọng: Nhận mã trạng thái 200 OK, không chuyển hướng sang HTTPS.


Bước 7: Chạy lệnh Certbot, cung cấp chứng chỉ và lưu
    bash:
        docker compose run --rm certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email 2k1.xam@gmail.com \
        --agree-tos \
        --no-eff-email \
        -d hdp.io.vn -d www.hdp.io.vn \
        -v

    Kỳ vọng: Chứng chỉ được tạo và lưu trong ./nginx/certbot/conf/live/hdp.io.vn/.
    bash:
        ls -la ./nginx/certbot/conf/live/hdp.io.vn/
    
Bước 8: Cập nhật Nginx để sử dụng SSL
    sửa lại file nginx/nginx.conf trở lại ban đầu, có cả port 80 và 443 ssl

    bash:
        docker compose restart nginx

Bước 9: Kiểm tra chứng chỉ
    bash:
        docker compose run --rm certbot certificates

    test page:
    website: 
        https://hdp.io.vn
        https://www.hdp.io.vn
    Kỳ vọng: đã có khóa ssl

Bước 10: Cấu hình gia hạn tự động
    bash:
        sudo crontab -e
        # Thêm dòng:
        0 0,12 * * * docker compose -f /home/ubuntu/education/docker-compose.yml run --rm certbot renew && docker compose -f /home/ubuntu/education/docker-compose.yml restart nginx

        save lại

Bước Bổ sung:
    set docker compose log/letsencrypt để xem log
    certbot:
        image: certbot/certbot
        container_name: education-certbot
        volumes:
            - ./nginx/certbot/www:/var/www/certbot
            - ./nginx/certbot/conf:/etc/letsencrypt
            - ./nginx/certbot/log:/var/log/letsencrypt

    bash:
        mkdir -p ./nginx/certbot/log
        chmod -R 755 ./nginx/certbot/log

        # create log
        docker compose run --rm certbot certificates

Một số thư mục khi hoàn thành
ubuntu@ip-172-31-17-230:~/education$ ls -la nginx/certbot/conf/live/hdp.io.vn/
total 12
drwxr-xr-x 2 root root 4096 Jun 24 12:40 .
drwxr-xr-x 3 root root 4096 Jun 24 12:40 ..
-rwxr-xr-x 1 root root  692 Jun 24 12:40 README
lrwxrwxrwx 1 root root   33 Jun 24 12:40 cert.pem -> ../../archive/hdp.io.vn/cert1.pem
lrwxrwxrwx 1 root root   34 Jun 24 12:40 chain.pem -> ../../archive/hdp.io.vn/chain1.pem
lrwxrwxrwx 1 root root   38 Jun 24 12:40 fullchain.pem -> ../../archive/hdp.io.vn/fullchain1.pem
lrwxrwxrwx 1 root root   36 Jun 24 12:40 privkey.pem -> ../../archive/hdp.io.vn/privkey1.pem

ubuntu@ip-172-31-17-230:~/education$ ls -la nginx/certbot/www/.well-known/acme-challenge/test.txt 
-rw-rw-r-- 1 ubuntu ubuntu 5 Jun 24 12:35 nginx/certbot/www/.well-known/acme-challenge/test.txt

ubuntu@ip-172-31-17-230:~/education$ ls -la nginx/certbot/log/letsencrypt.log
-rw-r--r-- 1 root root 722 Jun 24 15:35 nginx/certbot/log/letsencrypt.log