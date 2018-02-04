////////////////////////////////////////////////////
//                    README                      //
////////////////////////////////////////////////////

Contenu :
---------
   Ce fichier contient toutes les instructions pour installer et utiliser le site "youtube" crée dans le cadre 
   des enseignements "Big Data" et "Architecture Multimédias" de la filière RéVA.
   Le site est conçu pour fonctionner sous la version 16.04 LTS de Ubuntu.

Liste des paquets à installer :
-------------------------------
   Paquets à installer avec la commande apt-get install :
      - mariadb-server*
      - mariadb-client*
      - mongodb**
      - nodejs***

      *Après installation via apt-get, suivez les instruction suivantes:
         - Entrez, sur un terminal, "my_sql_secure_installation" et suivez les indications de l'installeur (pas de mots de passe pour toutes les étapes)


      **Si mongodb n'est pas déjà installé sur votre poste, entrez les commandes suivantes à la suite :
          sudo apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv 2930ADAE8CAF5059EE73BB4B58712A2291FA4AD5
          echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu xenial/mongodb-org/3.6 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-3.6.list
          sudo apt-get update
          sudo apt-get install -y mongodb-org

          Une description plus détaillée de l'installation est disponible à l'adresse suivante :
              https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/


      ***Entrez les commandes suivantes à la suite :
           sudo apt-get update && sudo apt-get -y upgrade
           curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
		   sudo apt-get install -y nodejs


   Installation de VLC :
      Si ce n'est pas déjà fait, installez la dernière version de VLC disponible pour Ubuntu (2.2.2-5ubuntu0.16.04.4 à l'heure de l'écriture du README).

Utilisation :
-------------
   1. A l'aide d'un terminal, placez vous à la racine du dossier contenant le site. Vous devriez voir les dossiers "css",
      "js", "model", "node_modules" et "view".

   2. Tapez et lancez la commande : nodejs launch.js.

   3. Lancez les services "mongod" et"mysql".

   4. Ouvrez votre navigateur et allez sur l'url suivante : localhost:8000

   5. A cette étape vous êtes prêts à naviguer sur le site "youtube Big Data".