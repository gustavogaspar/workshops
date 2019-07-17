#!/bin/bash
echo 'Atualizando pacotes... Este passo pode demorar alguns minutos'
sudo yum update -y

echo "##############################################################"
echo 'Instalando pacotes necessarios para o Workshop...'
echo 'Passo 1 - git'
sudo yum install -y git
echo 'Passo 2 - Nodejs'
echo 'Adicionando repo para Nodejs versão 10...'
sudo curl -sL https://rpm.nodesource.com/setup_10.x | sudo -E bash -
echo 'Instalando Node 10.x...'
sudo yum install -y nodejs 
echo 'Passo 3 - Unzip'
sudo yum install -y unzip
echo 'Passo 4 - Nginx'
echo 'Adicionando repo para Nginx'
sudo cat <<EOT >> /etc/yum.repos.d/nginx.repo
[nginx]
name=nginx repo
baseurl=http://nginx.org/packages/mainline/centos/7/$basearch/
gpgcheck=0
enabled=1
EOT
echo 'Instalando Nginx'
sudo yum install -y nginx

echo "##############################################################"
echo "Configurando ambiente..."
echo "Criando diretorio de desenvolvimento /home/dev"
sudo mkdir /home/dev
echo "Desabilitando serviço de firewall"
sudo systemctl stop firewalld
sudo systemctl disable firewalld
sudo systemctl mask --now firewalld
echo "Habilitando NGINX"
sudo systemctl enable nginx -y
sudo systemctl start nginx -y

echo "A preparação da instancia foi concluida com sucesso"


