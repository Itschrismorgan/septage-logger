# **Free Code Camp Project**

### Contributers:

* Chris Morgan
* Luke


### User Accounts

*Types*

* Admin
* Contractor
* Driver


*Admin Account*

* Can create all types of accounts.
* Manages the list of spread sites.
* Can create/edit companies.
* Can create/edit all trucks.


*Contractor Account*
* Can create driver accounts.
* Can create/edit tracks for only the company the contractor belongs to.




*Driver Account*

* Can only access the driver screen to log pickups and discharges at spread sites.



### Deployment

*Heroku Deployment*

The current app name on Heroku is whispering-beach-6783

Get the Heroku tookbelt from here: https://toolbelt.heroku.com/

Use the following command to add a git remote that is attached to the Heroku app

    heroku git:remote -a whispering-beach-6783

To verify that the above command work type the following command:

    $ git remote -v


Which should so the following remotes:

    heroku  https://git.heroku.com/whispering-beach-6783.git (fetch)
    heroku  https://git.heroku.com/whispering-beach-6783.git (push)

Deploy the app to Heroku with the following command:

    git push heroku master
    
The above command will push the code tracked by Git from the local (not Github) and then execute a couple commands.

It will execute a grunt command to build the minified Javascript and the execute the startup command

    grunt
    npm start
    
    
*Server Setup*

To have a functioning application you need to have a Heroku dyno and a instant of Mongolab.

You will need to have a single enviroment variable defined in Heroku.  
The variable was changed from MONGOLAB_URI to be more generic.

    MONGODB_URI=mongodb://heroku_example:example.mongolab.com:11111/heroku_example
    
For local development create a local enviroment variable with this:

    export MONGODB_URI=mongodb://localhost
    
    
For first time server setup run the following to setup the seed user:

    $ heroki run bash
    ~ $ node utility/createUser.js username password email
    
    
There is a 'Beta' Heroku instance that will be updated on every push to master on Github. 
    septage-beta.herokuapp.com