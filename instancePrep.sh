#!/bin/bash
echo "##############################################################"
echo 'Instalando pacotes necessarios para o Workshop...'

echo 'Passo 1 - Nodejs'
echo 'Adicionando repo para Nodejs versão 10...'
sudo curl -sL https://rpm.nodesource.com/setup_10.x | sudo -E bash -
echo 'Instalando Node 10.x...'
sudo yum install -y nodejs 
echo 'Passo 2 - Unzip'
sudo yum install -y unzip
echo 'Passo 3 - Nginx'
sudo yum install -y nginx
echo 'Passo 4 - Instalando client de Banco de dados'
sudo yum install -y /home/workshops/lib/oracle-instantclient19.3-basic-19.3.0.0.0-1.x86_64.rpm
export LD_LIBRARY_PATH=/usr/lib/oracle/19.3/client64/lib

echo "##############################################################"
echo "Configurando ambiente..."
echo "Criando diretorio de desenvolvimento /home/dev"
sudo mkdir /home/dev
echo "Desabilitando serviço de firewall"
sudo systemctl stop firewalld
sudo systemctl disable firewalld
sudo systemctl mask --now firewalld
echo "Habilitando NGINX"
sudo systemctl enable nginx
sudo systemctl start nginx

echo "A preparação da instancia foi concluida com sucesso"
