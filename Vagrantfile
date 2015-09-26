# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  hostname="performanceJS.box"
  locale = "en_US.UTF-8"

  config.vm.box = "ubuntu/trusty64"


  # accessing "localhost:8080" will access port 80 on the guest machine.
  config.vm.network "forwarded_port", guest: 3000, host: 8080
  config.vm.network "forwarded_port", guest: 80, host: 8888

  # Share an additional folder to the guest VM. The first argument is
  # the path on the host to the actual folder. The second argument is
  # the path on the guest to mount the folder. And the optional third
  # argument is a set of non-required options.
  config.vm.synced_folder ".", "/srv"

  # Provider-specific configuration so you can fine-tune various
  # backing providers for Vagrant. These expose provider-specific options.
  # Example for VirtualBox:
  #
  config.vm.provider "virtualbox" do |vb|
      vb.gui = true
      vb.memory = "1024"
   end

  config.vm.provision "shell", inline: <<-SHELL
     hostnamectl set-hostname #{hostname} && local-gen #{locale}
     sudo apt-get update --fix-missing
     sudo apt-get install -q -y g++ make git curl vim
     curl --silent --location https://deb.nodesource.com/setup_4.x | sudo bash -
     sudo apt-get install --yes nodejs
     sudo npm install -g grunt grunt-cli
  SHELL
end
