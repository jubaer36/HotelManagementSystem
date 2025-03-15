<h1 align="center">The Continental</h1>

<p align="center">
A sql based Hotel Management System. The frontend is implemented with the help of react and the backend is implemented with java-script. For the database part we used mysql
</p>

## Team Members
- [Shufan Shahi](https://github.com/shufanshahi)
- [Abdullah Al Jubaer Gem](https://github.com/jubaer36)
- [Asif or Alif Rashid ](https://github.com/alifrashid00)

## Build and Run

### Clone the repository
To clone the repository, type the command in any folder.
```
git clone https://github.com/jubaer36/HotelManagementSystem
```
This will create a folder `HotelManagementSystem` in that directory. 
It will have a complete copy of this repository. With a '.git' folder inside.

### Download packages
Open the terminal and run this command once in the frontend folder and once in backend folder

```
npm i
```
Then setup the `.env` .In .env to generate the `JWT_SECRET` type this command

```
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```
open an terminal and run in the frontend folder

```
 npm start
```
<p>
this  will start the frontend. Then open another terminal at the backend folder and run this command
</p>

```
node index.js
```
