Microsoft Project Oxford Face API Javascript Sample
====
[Microsoft Project Oxford Face API](https://www.projectoxford.ai/face) 'severless' sample. it's unofficial


## Description
 
 Sample code for Microsoft Project Oxford Face API via getUsermedia/Streaming API.you can understand flow for severless face identify flow.create parson group,add parson,register face 


## Requirement

over node.js 5.8 and browser,without ie and safari 

## Install and Usage

1. download or clone repozitory
2. go local directry and enter this command.

```
npm install
```
3. get Project Oxford account
4. your apikey here in const/apikey.template.js replace your apikey
5. rename const/apikey.template.js to rename const/apikey.js 
6. enter this command.

```
node create_group.js
```
 
7. identify.html create parson
8. enter this command.

```
node train_person_group.js
```

9 after same minutes,enter this command and check train status 'succeed'

```
node get_person_group_training_status.js
```

10 open identify.html in youre browser and identify face.


## Licence

MIT Licence

## Author

takayuki hagiwara hagiwaratakayuki@gmail.com
