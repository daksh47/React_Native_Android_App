This is a Simple Android App, which fetchs user data from https://random-data-api.com/api/users/random_user and displays the user data,
for example:
	email
	password
	username, etc...
	

Initially random 10 users data is fetched using https://random-data-api.com/api/users/random_user?size=10 and stored locally. Using the navigation buttons you can either go to the previous user or the next user, depending on the button clicked. 
	If there are no previous user, it displays and appropriate message  
	If the 10th user is reached, fetch 10 random user data again from above api, this process repeats till a total of only 80 users have been fetched.

## EXTRA NOTES

### why not fetching 1 user at a time?

fetching a random user data everytime upon navigation, increases the server load, also slows down the application.

### why not fetching all 80 users at once?

as the quantity of users might look small, it could be considered as an solution, but what if you need to scale the app, lets say you have to fetch 1000+ users, then using the above method of fetching all users at once might not come handy, as it would also increase the response time and the increase the memory consumed, also it would require time and resources to make changes to the application. which is clearly inefficient.

### then why fetching 10 users at a time?

to create a balance between number of users fetched and number of api calls made, which doesn't even increase the loading time nor does significantly affect the memory consumption

### why storing the users locally?

to keep a track of previous/next (already fetched) users. If the data is not stored and we are fetching RANDOM USER again on previous/next navigation, it contradicts to meaning of previous/next user.

### what are the other solutions?

to improve the efficiency, we could play around with the fixed constraint of loading 10 users at time. In this case all the users fetched as stored locally, so lets say to improve the memory utilization of the application, we could only store 10 users locally not matter how many users we fetch, unlike the current implementation, for example:

current:
	20 users fetched, 20 users stored locally
 
improved:
	20 users fetched, 10 users stored locally

## how and why?

after setting a constraint lets say 4-6 users for the current fetched, after this constraint, the previous 10 users are deleted, that is lets say u have 20 users and currently if we are viewing the 14-16th user, we will delete the 1-10th user, leading to efficient memory management.

also here is another thing than can be done,

out of 10 users, when navigating backward if the user 2-4th is reached, then if earlier users exists then load 10 of them and when navigating forward if the user 7-9th is reached, then laod the next set of 10 users if 80 users not already loaded

### THIS IS ONLY APPLICABLE IF THE USERS ARE FIXED, AND NOT RANDOM

## Edge Cases and potential errors

what if the user continously keeps clicking the next button, the time between each click is few ms, which would cause the application to send multiple api requests leading to server load, late response, and unresponsive request, hence, added a loading animation between the complete fetch of the data and displaying the same.

## How to run

download, install and setup npm ( refer : https://nodejs.org/en )

then clone this repo on your machine using ( git clone https://github.com/daksh47/React_Native_Android_App.git )

then open cmd and navigate to the directory ( cd React_Native_Android_App )
 - npm i -g expo-cli
 - npm install
 - npm start

if you are using a physical device
 - you will see a qr code in your cmd
 - then go on your device => install Expo Go ( https://expo.dev/go )
 - Make sure your both the devices ( desktop and mobile ) are on the same network
 - finally run the app and press "Scan QR Code"

if you are using emulator
 - make sure the emulator is running and online
 - if you have single emulator running => press "a" in the cmd
 - if you have more than one => press "shift+a" in the cmd
 - then select your emulator
 - then the rest task will be completed automatically
